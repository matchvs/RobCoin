cc.Class({
    extends: cc.Component,

    properties: {
        selfNode: cc.Node,
        rivalNode: cc.Node
    },

    onLoad() {
        Game.PlayerManager = this;
        this.self = this.selfNode.getComponent("player");
        this.self.init(GLB.playerUserIds[0]);
        this.rival = this.rivalNode.getComponent("player");
        this.rival.init(GLB.playerUserIds[1]);
        this.player1StartPos = this.selfNode.position;
        this.player2StartPos = this.rivalNode.position;

        if (!GLB.isRoomOwner) {
            this.selfNode.position = this.player2StartPos;
            this.rivalNode.position = this.player1StartPos;
        }
    }
});
