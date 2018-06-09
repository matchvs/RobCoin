// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speedX: 0,
        bullets: [cc.Node],
        bulletParent: cc.Node,
        itemSp: cc.Node
    },

    onLoad() {
        this.isDestroy = false;
    },

    init(itemId) {
        this.itemId = itemId;
    },

    explosion(hostPlayerId) {
        this.isDestroy = true;
        this.node.getComponent(cc.BoxCollider).enabled = false;
        this.bulletParent.active = true;
        this.itemSp.active = false;
        for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i].getComponent("bullet");
            if (bullet) {
                bullet.init(hostPlayerId)
            }
        }
        if (GLB.userInfo.id === hostPlayerId) {
            this.bulletParent.rotation = 0;
        } else {
            this.bulletParent.rotation = 180;
        }
    },

    update(dt) {
        if (!this.isDestroy) {
            this.node.x += this.speedX * dt;
        }
    }

});
