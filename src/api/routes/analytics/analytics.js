const express = require('express');
const pieChart = require('./charts/piechart');
const scans = require('./scans');
const lineChart = require('./charts/linechart');
const calendarChart = require('./charts/calendarchart');
const overview = require('./overview');

const router = express.Router();

router.get('/stats', pieChart);
router.get('/scans', scans);
router.get('/scans/:equipmentId/:startDate/:endDate', lineChart);
router.get('/calendar', calendarChart);
router.get("/overview", overview);

module.exports = router;