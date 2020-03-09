const mongoose = require('mongoose');
const Scan = require("../../mongodb/schema/Scan");

function componentScanList(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find({
        equipmentId: req.params.equipmentId,
        componentId: req.params.componentId
    }).limit(parseInt(req.params.limit)).sort({time: 'descending'}).exec(function (err, scans) {
        if (scans == null)
            return res.send([{}]);

        return res.send(JSON.stringify(scans));
    });
}

module.exports = componentScanList;