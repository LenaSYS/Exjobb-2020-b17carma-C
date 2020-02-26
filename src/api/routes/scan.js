const express = require('express');
const mongoose = require('mongoose');
const scanSchema = require("../mongodb/schema/ScanSchema");

const router = express.Router();

let ScanModel = mongoose.model("Scan", scanSchema, "equipment");

router.post('/', function (req, res) {
   mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});
   console.log("Saved scan. Equipment Id: " + req.body.equipmentId + ", Part Id: " + req.body.partId + ", Status: " + req.body.status);

   let scanResult = new ScanModel({
      equipmentId: req.body.equipmentId,
      partId: req.body.partId,
      status: req.body.status,
      time: new Date()
   });

   scanResult.save(function (err) {
      if (err)
         return console.log("error saving scan")
   });

    return res.send({"status": "ok"});
});

router.get('/:equipmentId', function (req, res) {
   mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

   ScanModel.find({equipmentId: req.params.equipmentId}).exec(function (err, equipment) {
      if (equipment == null)
         return res.send([{}]);

      return res.send(JSON.stringify(equipment));
   });
});

router.get('/:equipmentId/:partId', function (req, res) {
   mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

   ScanModel.find({equipmentId: req.params.equipmentId, partId : req.params.partId}).exec(function (err, equipment) {
      if (equipment == null)
         return res.send([{}]);

      return res.send(JSON.stringify(equipment.parts));
   });
});

module.exports = router;