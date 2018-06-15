var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        rotationSpeed: 0,
        deadClip: {
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

    onLoad() {
        this.targetRotation = this.node.rotation;
        this.anim = this.node.getComponent(cc.Animation);
        this.orginAnchorX = 0.5;
        this.orginAnchorY = 0.5;
        this.anchorOffsetX = 0.25;
        this.anchorOffsetY = 0.1;
        this.deadFloorY = -110;
        this.deadCeilY = 730;
        this.deadLimitX = 270;
    },

    init(playerId) {
        this.playerId = playerId;
        this.isDead = false;
        this.direction = DirectState.None;
    },

    dead() {
        var boom = cc.instantiate(this.tankBoom);
        boom.parent = this.node;
        boom.position = cc.v2(0, 0);
        cc.audioEngine.play(this.deadClip, false, 1);
        if (GLB.isRoomOwner) {
            var msg = {
                action: GLB.GAME_OVER_EVENT
            };
            Game.GameManager.sendEventEx(msg);
        }
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
        console.log(this.node.position);
        if ((Math.abs(this.node.x) > this.deadLimitX || this.node.y > this.deadCeilY || this.node.y < this.deadFloorY)) {
            this.dead();
        }
    },


    dead() {
        this.isDead = true;
        this.node.anchorX = this.orginAnchorX;
        this.node.anchorY = this.orginAnchorY;
        var efx = cc.instantiate(this.deadEffectPrefab);
        efx.parent = this.node.parent;
        efx.position = this.node.position;
        this.anim.play("die");
        if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
            setTimeout(function() {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.DEAD_EVENT,
                    playerId: this.playerId
                }));
            }.bind(this), 2000);
        }
    },

    reborn() {
        this.isDead = false;
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
        if (this.isDead) {
            return;
        }
        this.node.rotation = cc.lerp(this.node.rotation, this.targetRotation, 20 * dt);
    }
});
