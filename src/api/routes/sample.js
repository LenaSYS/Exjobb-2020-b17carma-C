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
            return console.log("error saving sample equipment " + err);

        let part1 = new Part(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be0'),
                equipment: equipment._id,
                identifier: 'Hinge',
                image: 'hinge.jpg',
                description: 'A very important part which has to be carefully inspected'
            }
        );

        let part2 = new Part(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be1'),
                equipment: equipment._id,
                identifier: 'Bearings',
                image: 'bearings.jpg',
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

    let equipment2 = new Equipment(
        {
            _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366bde'),
            identifier: 'LG932-A',
            image: 'machine.jpg',
        });

    return res.send({"status": "created"});
});

router.get('/scans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    function randomDate(start, end, startHour, endHour) {
        let date = new Date(+start + Math.random() * (end - start));
        let hour = startHour + Math.random() * (endHour - startHour) | 0;
        date.setHours(hour);
        return date;
    }

    let i;
    for (i=0;i<1000;i++) {
        let scan = new Scan({
            equipmentId: '5e53f1c36c7df42438366bde',
            partId: '5e53f1c36c7df42438366be0',
            status: Math.random() >= 0.5,
            time: randomDate(new Date(2020, 0), new Date(2020, 11), 0, 23)
        });

        scan.save(function (err) {
            if (err)
                return console.log("error saving sample equipment");

            const filter = {_id: scan.partId, equipment: scan.equipmentId};
            const update = {lastScan: scan._id};

            Part.updateOne(filter, update, function(err, doc) {
                if (err)
                    console.log(err);
            });
        });
    }

    return res.send({"status": "created"});
});

module.exports = router;