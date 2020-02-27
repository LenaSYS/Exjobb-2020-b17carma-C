const express = require('express');
const mongoose = require('mongoose');
const {isSameDay} = require('date-fns');

const router = express.Router();

let Equipment = require("../mongodb/schema/Equipment");
let Part = require("../mongodb/schema/Part");
let Scan = require("../mongodb/schema/Scan");

router.get('/:equipmentId/scans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Part.find({equipment: req.params.equipmentId}).populate('lastScan').lean().exec(function (err, parts) {
        let scanned = 0;
        let totalParts = parts.length;

        parts.map(function (part, i) {
            if (part.hasOwnProperty('lastScan')) {
                if (isSameDay(new Date(), part.lastScan.time)) {
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