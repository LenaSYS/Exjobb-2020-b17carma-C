const express = require('express');
const componentList = require("./componentlist");
const componentInfo = require("./componentinfo");
const componentSteps = require("./componentsteps");

const router = express.Router();

router.get('/:equipmentId', componentList);
router.get('/:equipmentId/:componentId', componentInfo);
router.get('/:equipmentId/:componentId/steps', componentSteps);

module.exports = router;