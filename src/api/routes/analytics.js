const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

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

router.get('/scans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find().lean().exec(function (err, scans) {
        return res.send(JSON.stringify(scans));
    });
});

router.get('/calendar', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find().lean().exec(function (err, scans) {
        let days = [];

        scans.map(function(scan, i) {
            let formattedDay = moment(scan.time).format('YYYY-MM-DD').toString();

            if (days.filter(e => e.day === formattedDay).length > 0) {
                let day = days.find(x => x.day === formattedDay);
                day.value = day.value + 1;
            } else {
                days.push({
                    day: formattedDay,
                    value: 1
                })
            }
        });
        return res.send(JSON.stringify(scans));
    });
});



module.exports = router;