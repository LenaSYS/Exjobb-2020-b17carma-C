const express = require('express');
const saveScan = require('./savescan');
const equipmentScanList = require('./equipmentscanlist');
const componentScanList = require('./componentscanlist');
const requiredScans = require('./requiredscans');

const router = express.Router();

router.post('/', saveScan);
router.get('/:equipmentId', equipmentScanList);
router.get('/:equipmentId/:componentId/:limit', componentScanList);
router.get("/required/:equipmentId/", requiredScans);

module.exports = router;