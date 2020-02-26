const express = require('express');
const mongoose = require('mongoose');
const equipmentSchema = require("../mongodb/schema/EquipmentSchema");

const router = express.Router();

let EquipmentModel = mongoose.model("Equipment", equipmentSchema, "equipment");

router.get('/', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.find().lean().exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

router.get('/:equipmentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.findOne({_id: req.params.equipmentId}).lean().exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

router.get('/:equipmentId/:partId', function(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.findOne({_id: req.params.equipmentId}).exec(function (err, equipment) {
        if (equipment == null)
            return res.send([{}]);

        return res.send(JSON.stringify(equipment.parts.id(req.params.partId)));
    });
});

module.exports = router;