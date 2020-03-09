const mongoose = require('mongoose');
const Equipment = require("../../mongodb/schema/Equipment");
const Component = require("../../mongodb/schema/Component");
const ComponentStep = require("../../mongodb/schema/ComponentStep");

function equipment(req, res) {
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
                description: 'A hinge used in some sort of process, very important component which has to be carefully inspected',
                frequency: 1,
                frequencyType: 0,
            }
        );

        let component2 = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be1'),
                equipment: equipment._id,
                identifier: 'Bearings',
                image: 'bearings.jpg',
                description: 'Some important component. Pay attention to xyz when inspecting it.',
                frequency: 1,
                frequencyType: 1,
                frequencyDays: [1]
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
                    description: 'Remove the lid, inspect oil inside the container, bla bla',
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
                description: 'Gears used for something',
                frequency: 2,
                frequencyType: 1,
                frequencyDays: [2, 3, 6]
            }
        );

        let component2 = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e5a7e6f682964512c73a490'),
                equipment: equipment2._id,
                identifier: 'Hinge',
                image: 'Hinge.jpg',
                description: 'Another hinge.',
                frequency: 3,
                frequencyType: 2,
                frequencyDays: [2, 3, 6]
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
}

module.exports = equipment;