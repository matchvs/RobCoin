var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,
    onLoad() {
        this.isInTrap = false;
    },

    init(playerId) {
        this.hostPlayerId = playerId;
    },

    onCollisionEnter: function(other, self) {
        var group = cc.game.groupList[other.node.groupIndex];
        switch (group) {
            case "trap":
                this.isInTrap = true;
                break;
            case "item":
                // 缩小药，获取
                if (GLB.isRoomOwner) {
                    mvs.engine.sendFrameEvent(JSON.stringify({
                        action: GLB.ITEM_GET,
                        playerId: this.hostPlayerId
                    }));
                }
                break;
            case "treasure":
                // 宝箱，获取
                if (GLB.isRoomOwner) {
                    mvs.engine.sendFrameEvent(JSON.stringify({
                        action: GLB.TREASURE_GET,
                        playerId: this.hostPlayerId
                    }));
                }
                break;
        }
    },
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function(other, self) {
        var group = cc.game.groupList[other.node.groupIndex];
        switch (group) {
            case "trap":
                this.isInTrap = false;
                break;
        }
    }
});
