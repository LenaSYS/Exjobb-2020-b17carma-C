const express = require('express');
const mongoose = require('mongoose');
const {isSameDay, utcToZonedTime} = require('date-fns');

const router = express.Router();

let Equipment = require("../mongodb/schema/Equipment");
let Part = require("../mongodb/schema/Part");
let Scan = require("../mongodb/schema/Scan");

router.get('/stats', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let successCount = 0;
    let failureCount = 0;

    Scan.find().lean().exec(function (err, scans) {
        scans.map(function (scan) {
            if (scan.status)
                successCount++;
            else
                failureCount++;
        });

        return res.send(JSON.stringify({
            totalScans: scans.length,
            successCount: successCount,
            failureCount: failureCount
        }));
    });
});

router.get('/:equipmentId/scans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let timeZone = 'Europe/Berlin';

    Part.find({equipment: req.params.equipmentId}).populate('lastScan').lean().exec(function (err, parts) {
        let scanned = 0;
        let totalParts = parts.length;

        parts.map(function (part, i) {
            if (part.hasOwnProperty('lastScan')) {
                let now = utcToZonedTime(new Date(), timeZone);
                let scanDate = utcToZonedTime(part.lastScan.time, timeZone);

                if (isSameDay(now, scanDate)) {
                    scanned++;
                }
            }
        });

        return res.send(JSON.stringify({
            totalParts: totalParts,
            scanned: scanned
        }));
    });
});

router.get('/scans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find().lean().exec(function (err, scans) {
        return res.send(JSON.stringify(scans));
    });
});

module.exports = router;