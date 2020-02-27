const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Equipment = require("../mongodb/schema/Equipment");

router.get('/', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Equipment.find().exec(function(err, equipment) {
        if (err)
            return console.log(err);

        return res.send(JSON.stringify(equipment));
    });
});

router.get('/:equipmentId', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Equipment.findOne({_id: req.params.equipmentId}).exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

module.exports = router;