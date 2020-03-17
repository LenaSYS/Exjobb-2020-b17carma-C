const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Scan = require("../../mongodb/schema/Scan");
const Component = require("../../mongodb/schema/Component");

function requiredScans(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Component.find({equipment: req.params.equipmentId}).populate('lastScan').lean().exec(function (err, components) {
        let actionRequiredComponents = [];

        components.map(function (component, i) {
            let frequency = component.frequency;
            let frequencyType = component.frequencyType;
            let frequencyDays = component.frequencyDays;
            let frequencyTypeString = frequencyType === 0 ? 'days' : frequencyType === 1 ? 'weeks' : frequencyType === 2 ? 'months' : frequencyType === 3 ? 'years' : null;

            let currentDate = moment();
            let currentDay = currentDate.isoWeekday();
            let earliestScanDate = moment(currentDate).startOf('day').subtract(1, frequencyTypeString);

            let lastScanToday = component.lastScan !== undefined && moment(component.lastScan.time).isSame(currentDate, 'day');

            Scan.countDocuments(
                {
                    equipment: req.params.equipmentId,
                    component: req.params.componentId,
                    time: {
                        $gte: moment(earliestScanDate).toDate(),
                        $lte: moment(currentDate).toDate()
                    },
                }
            ).exec(function (err, count) {
                if (err)
                    return console.log('err: ' + err);

                if (count < frequency && !lastScanToday && (frequencyDays.length === 0 || frequencyDays.includes(currentDay))) {
                    actionRequiredComponents.push(component);
                }

                if (i === components.length - 1) {
                    return res.send(JSON.stringify(actionRequiredComponents));
                }
            });
        });
    });
}

module.exports = requiredScans;
