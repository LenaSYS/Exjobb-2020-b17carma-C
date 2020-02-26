const express = require('express');
const mongoose = require('mongoose');
const scanSchema = require("../mongodb/schema/ScanSchema");
const equipmentSchema = require("../mongodb/schema/EquipmentSchema");

const router = express.Router();

let EquipmentModel = mongoose.model("Equipment", equipmentSchema, "equipment");
let ScanModel = mongoose.model("Scan", scanSchema, "scans");

router.get('/reset', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    EquipmentModel.deleteMany({});
    ScanModel.deleteMany({});

    return res.send({"status": "cleared"});
});

router.get('/createequipment', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let equipment = new EquipmentModel(
        {
            _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366bde'),
            identifier: 'LG932-A',
            image: 'machine.jpg',
            parts: [
                {
                    _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be0'),
                    identifier: 'Hinge',
                    image: 'machine.jpg',
                    description: 'A very important part which has to be carefully inspected'
                },
                {
                    _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be1'),
                    identifier: 'Bearings',
                    image: 'machine2.jpg',
                    description: 'Some important part. Pay attention to xyz when inspecting it.'
                },

            ]
        });

    let equipment2 = new EquipmentModel(
        {
            _id: new mongoose.Types.ObjectId('5e541d5eca12bc460ca4ee70'),
            identifier: 'JG923BV-A',
            image: 'machine2.jpg',
            parts: [
                {
                    _id: new mongoose.Types.ObjectId('5e541d5eca12bc460ca4ee72'),
                    identifier: 'Hinge',
                    image: 'machine.jpg',
                },
                {
                    _id: new mongoose.Types.ObjectId('5e541d5eca12bc460ca4ee73'),
                    identifier: 'Bearings',
                    image: 'machine2.jpg',
                },
                {
                    _id: new mongoose.Types.ObjectId('5e5536c1aa4b0040f88d680f'),
                    identifier: 'Couplings',
                    image: 'machine2.jpg',
                },
            ]
        });

    equipment.save(function (err) {
        if (err)
            return console.log("error saving sample equipment " + err)
    });

    equipment2.save(function (err) {
        if (err)
            return console.log("error saving sample equipment2 " + err)
    });

    return res.send({"status": "created"});
});

router.get('/createscans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let scan = new ScanModel({
        equipmentId: '5e53f1c36c7df42438366bde',
        partId: '5e53f1c36c7df42438366be0',
        status: true,
        time: new Date()
    });

    scan.save(function (err) {
        if (err)
            return console.log("error saving sample equipment")
    });

    return res.send({"status": "created"});
});

module.exports = router;