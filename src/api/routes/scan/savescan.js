const Scan = require("../../mongodb/schema/Scan");
const Component = require("../../mongodb/schema/Component");

function saveScan(req, res) {
    //console.log("Saved scan. Equipment Id: " + req.body.equipmentId + ", Component Id: " + req.body.componentId + ", Status: " + req.body.status);

    let scanResult = new Scan({
        equipmentId: req.body.equipmentId,
        componentId: req.body.componentId,
        status: req.body.status,
        time: new Date()
    });

    scanResult.save(function (err) {
        if (err)
            return res.send({"status": "error saving result"});

        const filter = {_id: req.body.componentId, equipment: req.body.equipmentId};
        const update = {lastScan: scanResult._id};

        Component.updateOne(filter, update, function (err) {
            if (err)
                return res.send({"status": "error updating component"});

            return res.send({"status": "ok"});
        });
    });
}

module.exports = saveScan;
