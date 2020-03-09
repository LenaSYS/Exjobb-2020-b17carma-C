const mongoose = require('mongoose');
const Component = require("../../mongodb/schema/Component");
const utils = require('./componentutils');

function componentList(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Component.find({equipment: req.params.equipmentId}).lean().populate('lastScan').exec(function (err, components) {
        if (components == null)
            return res.send([]);

        utils.addScanInfo(components);

        return res.send(JSON.stringify(components));
    });
}

module.exports = componentList;