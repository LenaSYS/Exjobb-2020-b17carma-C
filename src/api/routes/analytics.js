const express = require('express');
const mongoose = require('mongoose');
const equipmentSchema = require("../mongodb/schema/EquipmentSchema");
const scanSchema = require("../mongodb/schema/ScanSchema");
const { isSameDay } = require('date-fns');

const router = express.Router();

let EquipmentModel = mongoose.model("Equipment", equipmentSchema, "equipment");
let ScanModel = mongoose.model("Scan", scanSchema, "scans");


function scanStatus(scans, part) {
    var filteredScans = scans.filter(scan => scan.partId = part._id && isSameDay(new Date(), scan.time));

    console.log("size: " + filteredScans.length);

    if (filteredScans.length === 0)
        return 2;

    return filteredScans[0].status ? 0 : 1;
}

router.get('/scans/:equipmentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.findOne({_id: req.params.equipmentId}).lean().exec(function (err, equipment) {

        ScanModel.find({equipmentId: req.params.equipmentId}).sort({time: 'descending'}).exec(function (err, scans) {

            let scannedParts = 0;
            let totalParts = equipment.parts.length;

            equipment.parts.map(function (part, i) {
                if (scanStatus(scans, part) !== 2)
                    scannedParts++;
            });

            return res.send(
                {
                    "scanned": scannedParts,
                    "total": totalParts
                });
        });
    });
});

module.exports = router;