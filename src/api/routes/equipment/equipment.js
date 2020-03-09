const express = require('express');
const router = express.Router();
const equipmentList = require('./equipmentlist');
const equipmentInfo = require("./equipmentinfo");

router.get('/', equipmentList);
router.get('/:equipmentId', equipmentInfo);

module.exports = router;