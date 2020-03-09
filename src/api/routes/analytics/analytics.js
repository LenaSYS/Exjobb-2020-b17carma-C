const express = require('express');
const stats = require('./stats');
const scans = require('./scans');
const piechart = require('./charts/piechart');
const calendarChart = require('./charts/calendarchart');
const overview = require('./overview');

const router = express.Router();

router.get('/stats', stats);
router.get('/scans', scans);
router.get('/scans/:equipmentId/:startDate/:endDate', piechart);
router.get('/calendar', calendarChart);
router.get("/overview", overview);

module.exports = router;