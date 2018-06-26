cc.Class({
    extends: cc.Component,

    properties: {
        selfNode: cc.Node,
        rivalNode: cc.Node,
        guideCircleNode: cc.Node,
        guideMeNode: cc.Node
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
    },

    update(dt) {
        if (this.self.stepCnt > 5) {
            this.guideCircleNode.active = false;
            this.guideMeNode.active = false;
        } else {
            if (this.self.stepCnt % 2 === 0) {
                this.guideCircleNode.scaleX = -1;
            } else {
                this.guideCircleNode.scaleX = 1;
            }
            this.guideMeNode.position = this.self.node.position;
            this.guideCircleNode.position = this.self.node.position;
            this.guideCircleNode.rotation = this.self.node.rotation;
        }
    }
});
