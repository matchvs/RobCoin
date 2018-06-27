var mvs = require("Matchvs");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        bgmAudio: {
            default: null,
            url: cc.AudioClip
        },
        clickAudio: {
            default: null,
            url: cc.AudioClip
        },
        getItemAudio: {
            default: null,
            url: cc.AudioClip
        },
        getTreasureAudio: {
            default: null,
            url: cc.AudioClip
        },
        loseTreasureAudio: {
            default: null,
            url: cc.AudioClip
        },
        selfScoreBar: {
            default: null,
            type: cc.ProgressBar
        },
        rivalScoreBar: {
            default: null,
            type: cc.ProgressBar
        }
    },
    onLoad() {
        this._super();
        this.nodeDict["go"].on("click", this.sendGoMsg, this);
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.on(clientEvent.eventType.refreshSlateBtn, this.refreshSlateBtn, this);
        clientEvent.on(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);
        clientEvent.on(clientEvent.eventType.scoreGet, this.scoreGet, this);
        clientEvent.on(clientEvent.eventType.itemGet, this.itemGet, this);

        this.nodeDict["exit"].on("click", this.exit, this);
        this.anim =  this.nodeDict["scoreGetEffect"].getComponent(cc.Animation);
        this.anim.repeatCount = 3;
        this.bgmId = cc.audioEngine.play(this.bgmAudio, true, 0.2);
    },

    leaveRoom(data) {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    if (data.leaveRoomInfo.userId !== GLB.userInfo.id) {
                        uiTip.setData("对手离开了游戏");
                    }
                }
            }.bind(this));
        }
    },

    itemGet() {
        cc.audioEngine.play(this.getItemAudio, false, 1);
    },

    scoreGet(data) {
        if (data.playerId === GLB.userInfo.id) {
            // 自己获得分数
            cc.audioEngine.play(this.getTreasureAudio, false, 1);
            this.selfScoreBar.progress += 0.2;
        } else {
            // 对方获得分数
            cc.audioEngine.play(this.loseTreasureAudio, false, 1);
            this.rivalScoreBar.progress += 0.2;
        }
        this.anim.play();
    },

    sendGoMsg() {
        if (Game.PlayerManager.self.isDead) {
            return;
        }
        cc.audioEngine.play(this.clickAudio, false, 1);
        if (Game.GameManager.gameState === GameState.Play) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.DIRECTION_EVENT,
            }));
        }
    },


    exit() {
        uiFunc.openUI("uiExit");
    },

    gameOver: function() {
        this.nodeDict['gameOver'].getComponent(cc.Animation).play();
        this.nodeDict['gameOver'].getComponent(cc.AudioSource).play();

        cc.audioEngine.stop(this.bgmId);
    },

    roundStart: function() {
        this.nodeDict['readyGo'].getComponent(cc.Animation).play();
        this.nodeDict['readyGo'].getComponent(cc.AudioSource).play();
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.off(clientEvent.eventType.refreshSlateBtn, this.refreshSlateBtn, this);
        clientEvent.off(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);
        clientEvent.off(clientEvent.eventType.scoreGet, this.scoreGet, this);
        clientEvent.off(clientEvent.eventType.itemGet, this.itemGet, this);

    }
});
