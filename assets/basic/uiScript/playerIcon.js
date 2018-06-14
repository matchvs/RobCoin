cc.Class({
    extends: cc.Component,

    properties: {
        // playerName: {
        //     default: null,
        //     type: cc.Label
        //
        // },

        playerSprite: {
            default: null,
            type: cc.Sprite
        }
    },
    setData: function(userInfo) {
        this.userInfo = userInfo;
        this.playerId = userInfo.id ? userInfo.id : userInfo.userId;
        this.playerSprite.node.active = true;
    },

    init: function() {
        this.userInfo = null;
        this.playerSprite.node.active = false;
        // this.playerName.string = "null";
    },

    start() {
        this.init();
    }

    // update (dt) {},
});
