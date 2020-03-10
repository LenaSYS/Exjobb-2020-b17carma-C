const mongoose = require('mongoose');
const moment = require('moment');

const Scan = require("../../mongodb/schema/Scan");
const Component = require("../../mongodb/schema/Component");

function overview(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Component.find().populate('equipment').populate('lastScan').lean().exec(function (err, components) {
        let actionRequiredComponents = [];

        let startDate = moment(req.params.startDate).toDate();
        let endDate = moment(req.params.endDate).toDate();

        Scan.find({}, function (err, scans) {
            if (err)
                return console.log(err);

            for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
                let currentDate = moment(m);
                let currentDay = currentDate.day();
                let formattedDay = m.format("DD/MM/YY");

                actionRequiredComponents.push({
                    date: formattedDay,
                    data: [],
                });

                components.map(function (component, i) {
                    let frequency = component.frequency;
                    let frequencyType = component.frequencyType;
                    let frequencyDays = component.frequencyDays;
                    let frequencyTypeString = frequencyType === 0 ? 'days' : frequencyType === 1 ? 'weeks' : frequencyType === 2 ? 'months' : frequencyType === 3 ? 'years' : null;
                    let earliestScanDate = moment(currentDate).subtract(1, frequencyTypeString);
                    let lastScanToday = component.lastScan !== undefined && moment(component.lastScan.time).isSame(currentDate, 'day');
                    let scanCount = scans.filter(x => x.equipment === component.equipment && x.time > earliestScanDate && x.time < currentDate).length;

                    if (scanCount < frequency && (frequencyDays.length === 0 || frequencyDays.includes(currentDay))) {
                        let foundComponent = actionRequiredComponents.find(x => x.date === formattedDay);
                        let clonedComponent = Object.assign({}, component);

                        if (lastScanToday)
                            clonedComponent.scanStatus = component.lastScan.status;

                        foundComponent.data.push(clonedComponent);
                    }

                    if (i === components.length - 1 && !moment(currentDate).add(1, 'days').isBefore(moment(endDate))) {
                        return res.send(JSON.stringify(actionRequiredComponents));
                    }
                });
            }
        });
    });
}

module.exports = overview;