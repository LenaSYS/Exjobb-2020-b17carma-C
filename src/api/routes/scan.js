const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const scanSchema = require("../mongodb/schema/ScanSchema");

let ScanModel = mongoose.model("Scan", scanSchema, "equipment");

router.post('/', function(req, res) {
   console.log("equip: " + req.body.equipmentId + ", part: " + req.body.partId);
   return res.send([{}]);
});

module.exports = router;