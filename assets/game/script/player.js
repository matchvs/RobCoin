var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        rotationSpeed: 0,
        deadOutsideClip: {
            default: null,
            url: cc.AudioClip
        },
        deadHoleClip: {
            default: null,
            url: cc.AudioClip
        },
        leftFootNode: {
            default: null,
            type: cc.Node
        },
        rightFootNode: {
            default: null,
            type: cc.Node
        },
        footEffectPrefab: {
            default: null,
            type: cc.Prefab
        },
        deadEffectPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    init(playerId) {
        this.targetRotation = this.node.rotation;
        this.anim = this.node.getComponent(cc.Animation);
        this.orginAnchorX = 0.5;
        this.orginAnchorY = 0.5;
        this.anchorOffsetX = 0.25;
        this.anchorOffsetY = 0.1;
        this.deadFloorY = -110;
        this.deadCeilY = 730;
        this.deadLimitX = 270;
        this.trapDetectLeft = this.leftFootNode.getComponent("trapDetect");
        this.trapDetectRight = this.rightFootNode.getComponent("trapDetect");
        this.playerId = playerId;
        this.isDead = false;
        this.direction = DirectState.None;
        this.trapDetectLeft.init(this.playerId);
        this.trapDetectRight.init(this.playerId);
        this.stepCnt = 0;
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
    },

    // 缩小--
    tinySelf() {
        clearTimeout(this.tinyId);
        this.node.scale = 0.35;
        this.tinyId = setTimeout(function() {
            if (this.node) {
                this.node.scale = 1;
                if (GLB.isRoomOwner && Game.GameManager.gameState !== GameState.Over) {
                    mvs.engine.sendFrameEvent(JSON.stringify({
                        action: GLB.ITEM_EFFECT_DIS,
                        playerId: this.playerId
                    }));
                }
            }
        }.bind(this), 6000);
    },

    normalSelf() {
        this.node.scale = 1;
    },

    rotationSelf() {
        var dir = this.direction === DirectState.None ? 0 :
            this.direction === DirectState.Left ? -1 : 1;
        var deltaRotation = (1 / GLB.FRAME_RATE) * this.rotationSpeed * dir;
        this.targetRotation += deltaRotation;
    },

    changeDirection() {
        var dir = DirectState.None;
        if (this.direction === DirectState.Right) {
            dir = DirectState.Left;
        } else {
            dir = DirectState.Right;
        }
        this.setDirect(dir);
    },

    setDirect(dir) {
        this.node.rotation = this.targetRotation;
        if (this.direction === DirectState.Right) {// 向右旋转，以左脚为圆心--
            var worldPos = this.leftFootNode.convertToWorldSpaceAR(cc.v2(0, 0));
            var localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
            this.node.position = localPos;
        } else if (this.direction === DirectState.Left) {// 向左旋转，以右脚为圆心--
            var worldPos = this.rightFootNode.convertToWorldSpaceAR(cc.v2(0, 0));
            var localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
            this.node.position = localPos;
        }

        if (dir === DirectState.Right) {
            this.anim.play("onLeft");
        } else if (dir === DirectState.Left) {
            this.anim.play("onRight");
        }
        this.direction = dir;
        var dirValue = this.direction === DirectState.None ? 0 :
            this.direction === DirectState.Left ? -1 : 1;
        this.node.anchorX = this.orginAnchorX + this.anchorOffsetX * dirValue;
        this.node.anchorY = this.orginAnchorY + this.anchorOffsetY;
        if (this.direction !== DirectState.None) {
            this.spawnEffect();
        }
        if ((Math.abs(this.node.x) > this.deadLimitX || this.node.y > this.deadCeilY || this.node.y < this.deadFloorY)) {
            if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.DEAD_EVENT,
                    playerId: this.playerId
                }));
                cc.audioEngine.play(this.deadOutsideClip, false, 1);
            }
        } else {
            var trapDetect = dir === DirectState.Right ? this.trapDetectRight : this.trapDetectLeft;
            if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner && trapDetect.isInTrap) {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.DEAD_EVENT,
                    playerId: this.playerId
                }));
                cc.audioEngine.play(this.deadHoleClip, false, 1);
            }
        }
        // 重置判定
        this.trapDetectLeft.isInTrap = false;
        this.trapDetectRight.isInTrap = false;
        this.trapDetectLeft.node.active = dir === DirectState.Right;
        this.trapDetectRight.node.active = dir === DirectState.Left;
        // 引导线--
        this.stepCnt++;
    },


    deadFrameEvent() {
        if (this.isDead) {
            return;
        }
        this.isDead = true;
        this.node.anchorX = this.orginAnchorX;
        this.node.anchorY = this.orginAnchorY;
        var efx = cc.instantiate(this.deadEffectPrefab);
        efx.parent = this.node.parent;
        efx.position = this.node.position;
        this.anim.play("die");
        setTimeout(function() {
            if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.REBORN_EVENT,
                    playerId: this.playerId
                }));
            }
        }.bind(this), 2000);
    },

    rebornFrameEvent() {
        this.isDead = false;
        this.trapDetectLeft.isInTrap = false;
        this.trapDetectRight.isInTrap = false;
        this.node.scale = 1;
        this.node.anchorX = this.orginAnchorX;
        this.node.anchorY = this.orginAnchorY;
        if (GLB.isRoomOwner) {
            if (this.playerId === GLB.userInfo.id) {
                this.node.position = Game.PlayerManager.player1StartPos;
            } else {
                this.node.position = Game.PlayerManager.player2StartPos;
            }
        } else {
            if (this.playerId === GLB.userInfo.id) {
                this.node.position = Game.PlayerManager.player2StartPos;
            } else {
                this.node.position = Game.PlayerManager.player1StartPos;
            }
        }
        this.setDirect(DirectState.Right);
    },

    spawnEffect() {
        var efx = cc.instantiate(this.footEffectPrefab);
        efx.parent = this.node.parent;
        efx.position = this.node.position;
        efx.setSiblingIndex(0);
    },

    update(dt) {
        if (this.isDead || Game.GameManager.gameState === GameState.Over) {
            return;
        }
        //修改
        //this.node.rotation = cc.misc.lerp(this.node.rotation, this.targetRotation, 20 * dt);
        this.node.rotation = this.lerp(this.node.rotation, this.targetRotation, 20 * dt);
    },

    lerp(a,b,r){
        return a + (b - a) * r;
    },
    gameOver() {
        var isWin = Game.GameManager.isRivalLeave ? true : Game.GameManager.selfScore > Game.GameManager.rivalScore;
        if (this.playerId !== GLB.userInfo.id) {
            isWin = !isWin;
        }
        if (isWin) {
            this.anim.play("win");
        } else {
            this.anim.play("lose");
        }
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
    }
});
