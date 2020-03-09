const express = require('express');
const reset = require('./reset');
const equipment = require('./equipment');
const scans = require('./scans');

const router = express.Router();

router.get('/reset', reset);
router.get('/equipment', equipment);
router.get('/scans', scans);

module.exports = router;