const Component = require("../../mongodb/schema/Component");
const utils = require('./componentutils');

function componentInfo(req, res) {
    Component.findOne({
        equipment: req.params.equipmentId,
        _id: req.params.componentId
    }).populate('lastScan').populate('equipment').lean().exec(function (err, component) {
        if (component == null)
            return res.send({});

        utils.addComponentScanInfo(component);

        return res.send(JSON.stringify(component));
    });
}

module.exports = componentInfo;
