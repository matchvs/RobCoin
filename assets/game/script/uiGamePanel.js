var mvs = require("Matchvs");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        bgmAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad() {
        this._super();
        this.nodeDict["go"].on(cc.Node.EventType.TOUCH_START, this.sendGoMsg, this);
        this.nodeDict["shootButton"].on(cc.Node.EventType.TOUCH_START, this.sendFireMsg, this);
        this.defenseBtn = this.nodeDict["defenseButton"].getComponent(cc.Button);
        this.defenseBtn.enableAutoGrayEffect = true;
        this.defenseBtn.node.on(cc.Node.EventType.TOUCH_START, this.sendSlateMsg, this);
        this.lackBulletAnim = this.nodeDict["lackAmmunition"].getComponent(cc.Animation);
        this.cartridgeBullets = [].concat(this.nodeDict["cartridge"].children);
        this.bulletCnt = this.cartridgeBullets.length;
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.on(clientEvent.eventType.refreshSlateBtn, this.refreshSlateBtn, this);
        clientEvent.on(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);

        this.nodeDict["exit"].on("click", this.exit, this);

        this.bgmId = cc.audioEngine.play(this.bgmAudio, true, 1);
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

    sendGoMsg(direction) {
        if (Game.GameManager.gameState === GameState.Play) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.DIRECTION,
                direction: direction
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

    }
});
