const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = express.Router();
const scanSchema = require("../mongodb/schema/ScanSchema");

let ScanModel = mongoose.model("Scan", scanSchema, "equipment");

router.post('/', cors(), function(req, res) {
   console.log("equip: " + req.body.equipmentId + ", part: " + req.body.partId);
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