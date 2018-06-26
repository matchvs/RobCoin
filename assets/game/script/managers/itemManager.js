var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        potion: cc.Prefab,
        treasureBox: cc.Prefab,
        flyRivalPoint: cc.Node,
        flySelfPoint: cc.Node,
        clickAudio: {
            default: null,
            url: cc.AudioClip
        },
    },

    onLoad() {
        Game.ItemManager = this;
        this.item = null;
        this.treasure = null;
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.on(clientEvent.eventType.itemGet, this.itemGet, this);
        clientEvent.on(clientEvent.eventType.treasureGet, this.treasureGet, this);
    },

    roundStart() {
        setTimeout(function() {
            if (GLB.isRoomOwner) {
                var posX = dataFunc.randomNumArea(-230, -80, 80, 230);
                var posY = dataFunc.randomNumArea(-500, -250, 80, 200);
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.ITEM_SPAWN,
                    posX: posX,
                    posY: posY
                }));
            }
        }, 8000);
        setTimeout(function() {
            if (GLB.isRoomOwner) {
                var posX = dataFunc.randomNumArea(-230, -80, 80, 230);
                var posY = dataFunc.randomNumArea(-500, -250, 80, 180);
                if (Game.GameManager.selfScore === 0 && Game.GameManager.rivalScore === 0) {
                    posX = 0;
                    posY = 200;
                }
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.TREASURE_SPAWN,
                    posX: posX,
                    posY: posY
                }));
            }
        }, 4000);
    },

    itemGet() {
        this.item.destroy();
        setTimeout(function() {
            if (GLB.isRoomOwner) {
                var posX = dataFunc.randomNumArea(-230, -80, 80, 230);
                var posY = dataFunc.randomNumArea(-500, -250, 80, 200);
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.ITEM_SPAWN,
                    posX: posX,
                    posY: posY
                }));
            }
        }, 8000);
    },

    itemSpawn(cpProto) {
        this.item = cc.instantiate(this.potion);
        this.item.parent = this.node;
        this.item.position = cc.v2(cpProto.posX, cpProto.posY);
    },

    treasureGet(cpProto) {
        var temp = this.treasure;
        temp.getComponent(cc.BoxCollider).enabled = false;
        var pos = cpProto.playerId === GLB.userInfo.id ? this.flySelfPoint.position : this.flyRivalPoint.position;
        var action = cc.moveTo(0.2, pos);
        var finished = cc.callFunc(function() {
            temp.destroy();
        }.bind(this));
        var myAction = cc.sequence(action, finished);
        temp.runAction(myAction);
        setTimeout(function() {
            if (GLB.isRoomOwner) {
                var posX = dataFunc.randomNumArea(-230, -80, 80, 230);
                var posY = dataFunc.randomNumArea(-500, -250, 80, 200);
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.TREASURE_SPAWN,
                    posX: posX,
                    posY: posY
                }));
            }
        }, 8000);
    },

    treasureSpawn(cpProto) {
        this.treasure = cc.instantiate(this.treasureBox);
        this.treasure.parent = this.node;
        this.treasure.position = cc.v2(cpProto.posX, cpProto.posY);
    },

    gameOver() {
        clearInterval(this.scheduleItemId);
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.off(clientEvent.eventType.itemGet, this.itemGet, this);
        clientEvent.off(clientEvent.eventType.treasureGet, this.treasureGet, this);
    }

});
