const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Part = require("../mongodb/schema/Part");

router.get('/:equipmentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Part.find({equipment : req.params.equipmentId}).populate('lastScan').exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

router.get('/:equipmentId/:partId', function(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Part.findOne({equipment: req.params.equipmentId, _id: req.params.partId}).exec(function (err, part) {
        if (part == null)
            return res.send({});

        return res.send(JSON.stringify(part));
    });
});

module.exports = router;