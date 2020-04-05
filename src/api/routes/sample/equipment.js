const mongoose = require('mongoose');
const Equipment = require("../../mongodb/schema/Equipment");
const Component = require("../../mongodb/schema/Component");
const ComponentStep = require("../../mongodb/schema/ComponentStep");

function equipment(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let bottle = new Equipment(
        {
            _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366bde'),
            identifier: 'Bottle',
            image: 'bottle.jpg',
        });

    bottle.save(function (err) {
        if (err)
            return console.log("error saving sample equipment " + err);

        let bottleLabel = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be0'),
                equipment: bottle._id,
                identifier: 'Label',
                image: 'bottle_label.jpg',
                description: 'A label used to indicate the brand of the bottle',
                frequency: 1,
                frequencyType: 0,
            }
        );

        let bottleLid = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e53f1c36c7df42438366be1'),
                equipment: bottle._id,
                identifier: 'Lid',
                image: 'lid.jpg',
                description: 'A lid used to access the contents of the bottle',
                frequency: 1,
                frequencyType: 1,
            }
        );

        bottleLabel.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err);

            let inspectLabelStep = new ComponentStep(
                {
                    _id: new mongoose.Types.ObjectId('5e5cec8a31119e3070b939fd'),
                    equipment: bottleLabel.equipment,
                    component: bottleLabel._id,
                    identifier: 'Step 1',
                    order: 0,
                    description: 'Check the bottom of the label and make sure it says 980 G'
                });

            inspectLabelStep.save(function (err) {
                if (err)
                    return console.log("error saving sample equipment " + err)
            });
        });

        bottleLid.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err)
        });
    });

    let chair = new Equipment(
        {
            _id: new mongoose.Types.ObjectId('5e5a7e6f682964512c73a48e'),
            identifier: 'Chair',
            image: 'chair.jpg',
        });

    chair.save(function (err) {
        if (err)
            return console.log("error saving sample equipment " + err);

        let stand = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e5a7e6f682964512c73a48f'),
                equipment: chair._id,
                identifier: 'Stand',
                image: 'chair_stand.jpg',
                description: 'A stand used to hold the seat in place',
                frequency: 2,
                frequencyType: 1,
                frequencyDays: [1, 2, 3, 6]
            }
        );

        let seat = new Component(
            {
                _id: new mongoose.Types.ObjectId('5e5a7e6f682964512c73a490'),
                equipment: chair._id,
                identifier: 'Seat',
                image: 'chair_seat.jpg',
                description: 'A seat used to sit in',
                frequency: 3,
                frequencyType: 2,
            }
        );

        stand.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err);

            let inspectStandStep = new ComponentStep(
                {
                    equipment: stand.equipment,
                    component: stand._id,
                    identifier: 'Step 1',
                    order: 0,
                    description: 'Make sure there is no damage to the metal on the stand'
                });

            inspectStandStep.save(function (err) {
                if (err)
                    return console.log("error saving sample equipment " + err)
            });
        });

        seat.save(function (err) {
            if (err)
                return console.log("error saving sample equipment " + err);

            let inspectSeatStep = new ComponentStep(
                {
                    equipment: seat.equipment,
                    component: seat._id,
                    identifier: 'Step 1',
                    order: 0,
                    description: 'Make sure it is possible to turn the seat'
                });

            inspectSeatStep.save(function (err) {
                if (err)
                    return console.log("error saving sample equipment " + err)
            });
        });
    });

    return res.send({"status": "created"});
}

module.exports = equipment;
