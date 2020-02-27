const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

let Equipment = require("../mongodb/schema/Equipment");
let Part = require("../mongodb/schema/Part");
let Scan = require("../mongodb/schema/Scan");

router.get('/reset', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    Part.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    Equipment.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    return res.send({"status": "cleared"});
});

router.get('/equipment', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let equipment = new Equipment(
        {
            _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366bde'),
            identifier: 'LG932-A',
            image: 'machine.jpg',
        });

    equipment.save(function (err) {
        if (err)
            return console.log("error saving sample equipment " + err)

        let part1 = new Part(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be0'),
                equipment: equipment._id,
                identifier: 'Hinge',
                image: 'machine.jpg',
                description: 'A very important part which has to be carefully inspected'
            }
        );

        let part2 = new Part(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be1'),
                equipment: equipment._id,
                identifier: 'Bearings',
                image: 'machine2.jpg',
                description: 'Some important part. Pay attention to xyz when inspecting it.'
            }
        );

        part1.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err)
        });

        part2.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err)
        });
    });

    return res.send({"status": "created"});
});

router.get('/scans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let scan = new Scan({
        equipmentId: '5e53f1c36c7df42438366bde',
        partId: '5e53f1c36c7df42438366be0',
        status: true,
        time: new Date()
    });

    scan.save(function (err) {
        if (err)
            return console.log("error saving sample equipment");

        const filter = {_id: scan.partId, equipment: scan.equipmentId};
        const update = {lastScan: scan._id};

        Part.findOneAndUpdate(filter, update);
    });

    return res.send({"status": "created"});
});

module.exports = router;