const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

let Scan = require("../mongodb/schema/Scan");
let Part = require("../mongodb/schema/Equipment");

router.post('/', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Saved scan. Equipment Id: " + req.body.equipmentId + ", Part Id: " + req.body.partId + ", Status: " + req.body.status);

    let scanResult = new Scan({
        equipmentId: req.body.equipmentId,
        partId: req.body.partId,
        status: req.body.status,
        time: new Date()
    });

    scanResult.save(function (err) {
        if (err)
            return console.log("error saving scan");

        const filter = {_id: req.body.partId, equipment: req.body.equipmentId};
        const update = {lastScan : scanResult._id};

        Part.findOneAndUpdate(filter, update, function(err, doc) {
            if (err)
                console.log(err);
        });
    });

    return res.send({"status": "ok"});
});

router.get('/:equipmentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find({equipmentId: req.params.equipmentId}).sort({time: 'descending'}).exec(function (err, scans) {
        if (scans == null)
            return res.send([{}]);

        return res.send(JSON.stringify(scans));
    });
});

router.get('/:equipmentId/:partId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find({equipmentId: req.params.equipmentId, partId: req.params.partId}).sort({time: 'descending'}).exec(function (err, scans) {
        if (scans == null)
            return res.send([{}]);

        return res.send(JSON.stringify(scans));
    });
});

module.exports = router;