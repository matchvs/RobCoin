var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad() {
        this._super();
        setTimeout(function() {
            uiFunc.closeUI(this.node);
        }.bind(this), 2000);
    },

    setData(content) {
        this.nodeDict["tipLb"].getComponent(cc.Label).string = content;
    }
});
