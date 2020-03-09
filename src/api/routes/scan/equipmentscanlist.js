const mongoose = require('mongoose');
const Scan = require("../../mongodb/schema/Scan");

function equipmentScanList(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find({equipmentId: req.params.equipmentId}).sort({time: 'descending'}).exec(function (err, scans) {
        if (scans == null)
            return res.send([{}]);

        return res.send(JSON.stringify(scans));
    });
}

module.exports = equipmentScanList;