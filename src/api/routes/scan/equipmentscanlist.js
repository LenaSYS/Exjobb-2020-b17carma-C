const Scan = require("../../mongodb/schema/Scan");

function equipmentScanList(req, res) {
    Scan.find({equipmentId: req.params.equipmentId}).sort({time: 'descending'}).exec(function (err, scans) {
        if (scans == null)
            return res.send([{}]);

        return res.send(JSON.stringify(scans));
    });
}

module.exports = equipmentScanList;
