const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();

let Scan = require("../mongodb/schema/Scan");
let Component = require("../mongodb/schema/Component");

router.post('/', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Saved scan. Equipment Id: " + req.body.equipmentId + ", Component Id: " + req.body.componentId + ", Status: " + req.body.status);

    let scanResult = new Scan({
        equipmentId: req.body.equipmentId,
        componentId: req.body.componentId,
        status: req.body.status,
        time: new Date()
    });

    scanResult.save(function (err) {
        if (err)
            return console.log("error saving scan");

        const filter = {_id: req.body.componentId, equipment: req.body.equipmentId};
        const update = {lastScan: scanResult._id};

        Component.updateOne(filter, update, function (err, doc) {
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

router.get('/:equipmentId/:componentId/:limit', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find({
        equipmentId: req.params.equipmentId,
        componentId: req.params.componentId
    }).limit(parseInt(req.params.limit)).sort({time: 'descending'}).exec(function (err, scans) {
        if (scans == null)
            return res.send([{}]);

        return res.send(JSON.stringify(scans));
    });
});

router.get("/required/:equipmentId/", function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Component.find({equipment: req.params.equipmentId}).lean().exec(function (err, components) {
        let actionRequiredComponents = [];

        components.map(function (component, i) {
            let frequency = component.frequency;
            let frequencyType = component.frequencyType;
            let frequencyDays = component.frequencyDays;
            let frequencyTypeString = frequencyType === 0 ? 'days' : frequencyType === 1 ? 'weeks' : frequencyType === 2 ? 'months' : frequencyType === 3 ? 'years' : null;

            let currentDate = moment();
            let currentDay = currentDate.day();
            let earliestScanDate = moment(currentDate).subtract(1, frequencyTypeString);

            Scan.countDocuments(
                {
                    equipment: req.params.equipmentId,
                    component: req.params.componentId,
                    time: {
                        $gte: moment(earliestScanDate).toDate(),
                        $lte: moment(currentDate).toDate()
                    },
                }
            ).exec(function (err, count) {
                if (err)
                    return console.log('err: ' + err);

                console.log("count: " + count + ", frequency: " + frequency + ", currentday: " + currentDay + ", days: " + frequencyDays);
                if (count < frequency && (frequencyDays.length === 0 || frequencyDays.includes(currentDay))) {
                    console.log("pushing");
                    actionRequiredComponents.push(component);
                }

                if (i === components.length - 1) {
                    return res.send(JSON.stringify(actionRequiredComponents));
                }
            });
        });
    });
});

module.exports = router;