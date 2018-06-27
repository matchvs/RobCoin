var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
cc.Class({
    extends: uiPanel,

    properties: {
        loseClip: {
            default: null,
            url: cc.AudioClip
        },
        victoryClip: {
            default: null,
            url: cc.AudioClip
        }
    },

    start() {
        var isWin = Game.GameManager.isRivalLeave ? true : Game.GameManager.selfScore > Game.GameManager.rivalScore;

        this.player = this.nodeDict["player"].getComponent("resultPlayerIcon");
        this.player.setData(Game.PlayerManager.self.playerId);
        this.rival = this.nodeDict["rival"].getComponent("resultPlayerIcon");
        this.rival.setData(Game.PlayerManager.rival.playerId);
        this.nodeDict["vs"].active = false;
        this.nodeDict["score"].active = true;
        this.nodeDict["quit"].on("click", this.quit, this);

        this.nodeDict["lose"].active = !isWin;
        this.nodeDict["win"].active = isWin;

        if (isWin) {
            cc.audioEngine.play(this.victoryClip, false, 1);
        } else {
            cc.audioEngine.play(this.loseClip, false, 1);
        }
        this.nodeDict["playerScore"].getComponent(cc.Label).string = Game.GameManager.selfScore;
        this.nodeDict["rivalScore"].getComponent(cc.Label).string = Game.GameManager.rivalScore;
    },

    quit: function() {
        mvs.engine.leaveRoom("");
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            uiFunc.closeUI("uiGamePanel");
            gamePanel.destroy();
        }
        uiFunc.closeUI(this.node.name);
        this.node.destroy();


        Game.GameManager.lobbyShow();
    }
});
