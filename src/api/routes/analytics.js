const express = require('express');
const mongoose = require('mongoose');
const { isSameDay } = require('date-fns');

const router = express.Router();

let Equipment = require("../mongodb/schema/Equipment");
let Scan = require("../mongodb/schema/Scan");

function scanStatus(scans, part) {
    var filteredScans = scans.filter(scan => scan.partId = part._id && isSameDay(new Date(), scan.time));

    console.log("size: " + filteredScans.length);

    if (filteredScans.length === 0)
        return 2;

    return filteredScans[0].status ? 0 : 1;
}

module.exports = router;