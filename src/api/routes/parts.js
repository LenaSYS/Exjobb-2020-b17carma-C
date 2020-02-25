const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = express.Router();
var equipmentSchema = require("../mongodb/schema/EquipmentSchema");

let EquipmentModel = mongoose.model("Equipment", equipmentSchema, "equipment");

router.get('/:equipmentId', cors(), function(req, res) {
    mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.findOne({_id: req.params.equipmentId}).exec(function (err, equipment) {
        if (equipment == null)
            return res.send([{}]);

        return res.send(JSON.stringify(equipment.parts));
    });
});

router.get('/:equipmentId/:partId', cors(), function(req, res) {
    mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.findOne({_id: req.params.equipmentId}).exec(function (err, equipment) {
        if (equipment == null)
            return res.send([{}]);

        return res.send(JSON.stringify(equipment.parts.id(req.params.partId)));
    });
});

module.exports = router;