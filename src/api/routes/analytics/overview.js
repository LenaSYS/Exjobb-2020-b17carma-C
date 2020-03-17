const mongoose = require('mongoose');
const moment = require('moment-timezone');

const Scan = require("../../mongodb/schema/Scan");
const Component = require("../../mongodb/schema/Component");

function overview(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Component.find().populate('equipment').lean().exec(function (err, components) {
        let actionRequiredComponents = [];

        let startDate = moment(req.params.startDate);
        let endDate = moment(req.params.endDate);

        Scan.find().exec( function (err, scans) {
            if (err)
                return console.log(err);

            for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
                let currentDate = moment(m);
                let currentDay = currentDate.isoWeekday();
                console.log(currentDate.format("DD-MM-YY dddd - ISOWEEKDAY: " + currentDay + " NONISO: " + currentDate.day()));

                let saveObject = {
                    date: currentDate,
                    data: [],
                };

                actionRequiredComponents.push(saveObject);

                components.map(function (component) {
                    let expectedCount = component.frequency;
                    let frequencyType = component.frequencyType;
                    let frequencyDays = component.frequencyDays;
                    let frequencyTypeString = frequencyType === 0 ? 'day' : frequencyType === 1 ? 'week' : frequencyType === 2 ? 'month' : frequencyType === 3 ? 'year' : null;
                    let earliestScanDate = moment.startOf(frequencyTypeString);

                    let dailyScan = scans.find(scan => scan.equipmentId.toString() === component.equipment._id.toString() && scan.componentId.toString() === component._id.toString() && moment(scan.time).isSame(currentDate, "day"));
                    let scanCount = scans.filter(x => x.equipmentId.toString() === component.equipment._id.toString() && x.componentId.toString() === component._id.toString() && x.time > earliestScanDate.toDate() && x.time < currentDate.toDate()).length;

                    if ((scanCount < expectedCount || dailyScan != null) && (frequencyDays.length === 0 || frequencyDays.includes(currentDay))) {
                        let clonedComponent = Object.assign({}, component);

                        if (dailyScan != null) {
                            clonedComponent.scanStatus = dailyScan.status;
                        }

                        saveObject.data.push(clonedComponent);
                    }
                });
            }
            return res.send(JSON.stringify(actionRequiredComponents));
        });
    });
}

module.exports = overview;
