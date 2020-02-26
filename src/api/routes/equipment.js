const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const equipmentSchema = require("../mongodb/schema/EquipmentSchema");

let EquipmentModel = mongoose.model("Equipment", equipmentSchema, "equipment");

router.get('/', function (req, res) {
    mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.find().lean().exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

router.get('/:equipmentId', function (req, res) {
    mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.findOne({_id: req.params.equipmentId}).lean().exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

module.exports = router;