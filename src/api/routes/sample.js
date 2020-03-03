const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

let Equipment = require("../mongodb/schema/Equipment");
let Component = require("../mongodb/schema/Component");
let ComponentStep = require("../mongodb/schema/ComponentStep");
let Scan = require("../mongodb/schema/Scan");

router.get('/reset', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    ComponentStep.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    Component.deleteMany({}, function (err) {
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

        let component1 = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be0'),
                equipment: equipment._id,
                identifier: 'Hinge',
                image: 'hinge.jpg',
                description: 'A hinge used in some sort of process, very important component which has to be carefully inspected'
            }
        );

        let component2 = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be1'),
                equipment: equipment._id,
                identifier: 'Bearings',
                image: 'bearings.jpg',
                description: 'Some important component. Pay attention to xyz when inspecting it.'
            }
        );

        component1.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err);

            let componentStep = new ComponentStep(
                {
                    _id: new mongoose.Types.ObjectId('5e5cec8a31119e3070b939fd'),
                    equipment: component1.equipment,
                    component: component1._id,
                    identifier: 'Step 1',
                    order: 0,
                    image: 'machine.jpg',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
                });

            let componentStep1 = new ComponentStep(
                {
                    _id: new mongoose.Types.ObjectId('5e5cec8a31119e3070b93a00'),
                    equipment: component1.equipment,
                    component: component1._id,
                    identifier: 'Step 2',
                    order: 1,
                    description: 'Remove the lid, inspect oil inside the container, bla bla'
                });

            componentStep.save(function (err) {
                if (err)
                    return console.log("error saving sample equipment " + err)
            });

            componentStep1.save(function (err) {
                if (err)
                    return console.log("error saving sample equipment " + err)
            });
        });

        component2.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err)
        });
    });

    let equipment2 = new Equipment(
        {
            _id: new mongoose.Types.ObjectId('5e5a7e6f682964512c73a48e'),
            identifier: 'Binning Machine',
            image: 'machine2.jpg',
        });

    equipment2.save(function (err) {
        if (err)
            return console.log("error saving sample equipment " + err);

        let component1 = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e5a7e6f682964512c73a48f'),
                equipment: equipment2._id,
                identifier: 'Gears',
                image: 'gears.jpg',
                description: 'Gears used for something'
            }
        );

        let component2 = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e5a7e6f682964512c73a490'),
                equipment: equipment2._id,
                identifier: 'Hinge',
                image: 'Hinge.jpg',
                description: 'Another hinge.'
            }
        );

        component1.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err)
        });

        component2.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err)
        });
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
            componentId: '5e53f1c36c7df42438366be0',
            status: Math.random() >= 0.5,
            time: randomDate(new Date(2020, 0), new Date(2020, 11), 0, 23)
        });

        scan.save(function (err) {
            if (err)
                return console.log("error saving sample equipment");

            const filter = {_id: scan.componentId, equipment: scan.equipmentId};
            const update = {lastScan: scan._id};

            Component.updateOne(filter, update, function(err, doc) {
                if (err)
                    console.log(err);
            });
        });
    }

    return res.send({"status": "created"});
});

module.exports = router;