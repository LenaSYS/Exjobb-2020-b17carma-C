const Component = require("../../mongodb/schema/Component");
const utils = require('./componentutils');

function componentList(req, res) {
    Component.find({equipment: req.params.equipmentId}).lean().populate('lastScan').exec(function (err, components) {
        if (components == null)
            return res.send([]);

        utils.addScanInfo(components);

        return res.send(JSON.stringify(components));
    });
}

module.exports = componentList;
