const moment = require('moment-timezone');

const Scan = require("../../mongodb/schema/Scan");
const Component = require("../../mongodb/schema/Component");

function overview(req, res) {
    Component.find().populate('equipment').lean().exec(function (err, components) {
        let actionRequiredComponents = [];

        let startDate = moment(req.params.startDate);
        let endDate = moment(req.params.endDate);

        Scan.find().exec(function (err, scans) {
            if (err)
                return console.log(err);

            for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
                let currentDate = moment(m);
                let currentDay = currentDate.isoWeekday();

                let saveObject = {
                    title: currentDate,
                    data: [],
                };

                components.map(function (component) {
                    let expectedCount = component.frequency;
                    let frequencyType = component.frequencyType;
                    let frequencyDays = component.frequencyDays;
                    let frequencyTypeString = frequencyType === 0 ? 'day' : frequencyType === 1 ? 'week' : frequencyType === 2 ? 'month' : frequencyType === 3 ? 'year' : null;
                    let earliestScanDate = moment(currentDate).startOf(frequencyTypeString);

                    let dailyScan = scans.find(scan => scan.equipmentId.toString() === component.equipment._id.toString() && scan.componentId.toString() === component._id.toString() && moment(scan.time).isSame(currentDate, "day"));
                    let scanCount = scans.filter(x => x.equipmentId.toString() === component.equipment._id.toString() && x.componentId.toString() === component._id.toString() && x.time > earliestScanDate.toDate() && x.time < currentDate.toDate()).length;

                    if ((scanCount < expectedCount || dailyScan != null) && (frequencyDays.length === 0 || frequencyDays.includes(currentDay))) {
                        let clonedComponent = Object.assign({}, component);

                        if (dailyScan != null) {
                            clonedComponent.scanStatus = dailyScan.status;
                        }

                        let existingObject = saveObject.data.find(equip => {
                            return equip.equipment._id === clonedComponent.equipment._id
                        });

                        if (existingObject === undefined) {
                            let equipmentObject = {
                                equipment: clonedComponent.equipment,
                                components: [clonedComponent]
                            };

                            saveObject.data.push(equipmentObject);

                        } else {
                            existingObject.components.push(clonedComponent)
                        }

                    }
                });
                actionRequiredComponents.push(saveObject);
            }

            //Add analytic data for progress spinner
            actionRequiredComponents.forEach((component) => {
                component.data.forEach((equipment) => {
                    let total = equipment.components.length;
                    let count = 0;

                    equipment.components.forEach((eqComponent) => {
                        if (eqComponent.hasOwnProperty('scanStatus'))
                            count++;
                    });

                    equipment.progress = count / total * 100;
                })
            });

            return res.send(JSON.stringify(actionRequiredComponents));
        });
    });
}

module.exports = overview;
