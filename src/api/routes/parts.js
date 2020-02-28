const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();

const Part = require("../mongodb/schema/Part");
0
router.get('/:equipmentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Part.find({equipment : req.params.equipmentId}).lean().populate('lastScan').exec(function (err, parts) {
        parts.forEach(function(part) {
            if (part.hasOwnProperty('lastScan')) { //Add last scan info in backend to reduce front-end overhead
                let scanMoment = moment(part.lastScan.time);
                let currentMoment = moment(new Date());

                part.lastScanToday = currentMoment.isSame(scanMoment, 'day'); //Check if scan was made the same day as today
            }
        });

        return res.send(JSON.stringify(parts));
    });
});

router.get('/:equipmentId/:partId', function(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Part.findOne({equipment: req.params.equipmentId, _id: req.params.partId}).populate('lastScan').exec(function (err, part) {
        if (part == null)
            return res.send({});

        return res.send(JSON.stringify(part));
    });
});

module.exports = router;