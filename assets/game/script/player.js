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
        }
    },

    onLoad() {
        this.targetRotation = this.node.rotation;
        this.anim = this.node.getComponent(cc.Animation);
        this.orginAnchorX = 0.5;
        this.orginAnchorY = 0.5;
        this.anchorOffsetX = 0.25;
        this.anchorOffsetY = 0.1;
    },

    init(playerId) {
        this.playerId = playerId;
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
        if (this.direction === DirectState.Right) {
            var worldPos = this.leftFootNode.convertToWorldSpaceAR(cc.v2(0, 0));
            var localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
            this.node.position = localPos;
        } else if (this.direction === DirectState.Left) {
            var worldPos = this.rightFootNode.convertToWorldSpaceAR(cc.v2(0, 0));
            var localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
            this.node.position = localPos;
        }
        if (dir === DirectState.Right) {
            this.anim.play("onLeft");
        } else if (dir === DirectState.Left) {
            this.anim.play("onRight");
        }
        this.spawnEffect();
        this.direction = dir;
        var dir = this.direction === DirectState.None ? 0 :
            this.direction === DirectState.Left ? -1 : 1;
        this.node.anchorX = this.orginAnchorX + this.anchorOffsetX * dir;
        this.node.anchorY = this.orginAnchorY + this.anchorOffsetY;
        var offsetPosX = -this.node.width * this.anchorOffsetX * dir;
        var offsetPosY = this.node.height * this.anchorOffsetY;
        this.node.position.x += offsetPosX;
        this.node.position.y += offsetPosY;
        console.log(this.node.position);
    },

    spawnEffect() {
        var efx = cc.instantiate(this.footEffectPrefab);
        efx.parent = this.node.parent;
        efx.position = this.node.position;
        efx.setSiblingIndex(0);
    },

    update(dt) {
        this.node.rotation = cc.lerp(this.node.rotation, this.targetRotation, 3 * dt);
    }
});
