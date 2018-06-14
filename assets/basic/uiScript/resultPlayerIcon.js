cc.Class({
    extends: cc.Component,

    properties: {
        icon: {
            default: null,
            type: cc.Sprite
        },

        nameLb: {
            default: null,
            type: cc.Label
        }
    },

    setData: function(playerId) {
        this.nameLb.string = playerId;
    }

});
