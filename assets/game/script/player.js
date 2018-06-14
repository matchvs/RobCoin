cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0,
        deadClip: {
            default: null,
            url: cc.AudioClip
        }
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

    move() {
        var dir = this.direction === DirectState.None ? 0 :
            this.direction === DirectState.Left ? -1 : 1;
        var deltaX = (1 / GLB.FRAME_RATE) * this.speed * dir;
        this.targetPosX += deltaX;
        if (this.targetPosX < -GLB.limitX) {
            this.targetPosX = GLB.limitX + deltaX;
            this.node.x = GLB.limitX;
        }
        if (this.targetPosX > GLB.limitX) {
            this.targetPosX = -GLB.limitX + deltaX;
            this.node.x = -GLB.limitX;
        }
    },

    setDirect(dir) {
        this.direction = dir;
        //改变
    },

    update(dt) {
        if (this.heart > 0) {
            this.node.x = cc.lerp(this.node.x, this.targetPosX, 4 * dt);
        }
    }
});
