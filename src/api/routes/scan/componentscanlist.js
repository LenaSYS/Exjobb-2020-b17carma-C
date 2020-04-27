const Scan = require("../../mongodb/schema/Scan");

function componentScanList(req, res) {
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
