const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const router = express.Router();

const Component = require("../mongodb/schema/Component");
const ComponentStep = require("../mongodb/schema/ComponentStep");

function addScanInfo(components) {
    components.forEach(function (component) {
        addComponentScanInfo(component);
    });
}

function addComponentScanInfo(component) {
    if (component.hasOwnProperty('lastScan')) { //Add last scan info in backend to reduce front-end overhead
        let scanMoment = moment(component.lastScan.time);
        let currentMoment = moment(new Date());

        component.lastScanToday = currentMoment.isSame(scanMoment, 'day'); //Check if scan was made the same day as today
    } else {
        component.lastScanToday = false;
    }
}

router.get('/:equipmentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Component.find({equipment: req.params.equipmentId}).lean().populate('lastScan').exec(function (err, components) {
        if (components == null)
            return res.send([]);

        addScanInfo(components);

        return res.send(JSON.stringify(components));
    });
});

router.get('/:equipmentId/:componentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Component.findOne({
        equipment: req.params.equipmentId,
        _id: req.params.componentId
    }).populate('lastScan').populate('equipment').lean().exec(function (err, component) {
        if (component == null)
            return res.send({});

        addComponentScanInfo(component);

        return res.send(JSON.stringify(component));
    });
});

router.get('/:equipmentId/:componentId/steps', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    ComponentStep.find({equipment: req.params.equipmentId, component: req.params.componentId}).sort('order').lean().exec(function (err, steps) {
        if (steps == null)
            return res.send([]);

        return res.send(JSON.stringify(steps));
    });
});

module.exports = router;