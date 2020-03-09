const express = require('express');
const equipmentList = require('./equipmentlist');
const equipmentInfo = require("./equipmentinfo");
const cors = require('cors');

const router = express.Router();

router.options('*', cors());

router.get('/', equipmentList);
router.get('/:equipmentId', equipmentInfo);

module.exports = router;