const express = require('express');
const equipmentList = require('./equipmentlist');
const equipmentInfo = require("./equipmentinfo");

const router = express.Router();

router.get('/', equipmentList);
router.get('/:equipmentId', equipmentInfo);

module.exports = router;