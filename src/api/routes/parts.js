const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const router = express.Router();

const Part = require("../mongodb/schema/Part");
const PartStep = require("../mongodb/schema/PartStep");

function addScanInfo(parts) {
    parts.forEach(function (part) {
        addPartScanInfo(part);
    });
}

function addPartScanInfo(part) {
    if (part.hasOwnProperty('lastScan')) { //Add last scan info in backend to reduce front-end overhead
        let scanMoment = moment(part.lastScan.time);
        let currentMoment = moment(new Date());

        part.lastScanToday = currentMoment.isSame(scanMoment, 'day'); //Check if scan was made the same day as today
    } else {
        part.lastScanToday = false;
    }
}

router.get('/:equipmentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Part.find({equipment: req.params.equipmentId}).lean().populate('lastScan').exec(function (err, parts) {
        if (parts == null)
            return res.send([]);

        addScanInfo(parts);

        return res.send(JSON.stringify(parts));
    });
});

router.get('/:equipmentId/:partId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Part.findOne({
        equipment: req.params.equipmentId,
        _id: req.params.partId
    }).populate('lastScan').populate('equipment').lean().exec(function (err, part) {
        if (part == null)
            return res.send({});

        addPartScanInfo(part);

        return res.send(JSON.stringify(part));
    });
});

router.get('/:equipmentId/:partId/steps', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    PartStep.find({equipment: req.params.equipmentId, part: req.params.partId}).sort('order').lean().exec(function (err, steps) {
        if (steps == null)
            return res.send([]);

        return res.send(JSON.stringify(steps));
    });
});

module.exports = router;