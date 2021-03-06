const moment = require('moment-timezone');
const Scan = require("../../mongodb/schema/Scan");
const Component = require("../../mongodb/schema/Component");

function requiredScans(req, res) {
    Component.find({equipment: req.params.equipmentId}).populate('lastScan').lean().exec(function (err, components) {
        let actionRequiredComponents = [];

        components.map(function (component, i) {
            let frequency = component.frequency;
            let frequencyType = component.frequencyType;
            let frequencyDays = component.frequencyDays;
            let frequencyTypeString = frequencyType === 0 ? 'day' : frequencyType === 1 ? 'week' : frequencyType === 2 ? 'month' : frequencyType === 3 ? 'year' : null;

            let currentDate = moment();
            let currentDay = currentDate.isoWeekday();
            let earliestScanDate = moment(currentDate).startOf(frequencyTypeString);

            let lastScanToday = component.lastScan !== undefined && moment(component.lastScan.time).isSame(currentDate, 'day');


            Scan.countDocuments(
                {
                    equipmentId: req.params.equipmentId,
                    componentId: component._id,
                    time: {
                        $gte: moment(earliestScanDate).toDate(),
                        $lte: moment(currentDate).toDate()
                    },
                }
            ).exec(function (err, count) {
                if (err)
                    return console.log('err: ' + err);

                if (count < frequency && !lastScanToday && (frequencyDays.length === 0 || frequencyDays.includes(currentDay))) {
                    let clonedComponent = Object.assign({}, component);

                    actionRequiredComponents.push(clonedComponent);
                    console.log("Start Date: " + earliestScanDate.format('DD-MM-YYYY'));
                    console.log("End Date: " + currentDate.format('DD-MM-YYYY'));
                    console.log(component.identifier + " - " + " requires scan. Expected: " + frequency + ", actual: " + count + ", within: " + frequencyTypeString);
                }

                if (i === components.length - 1) {
                    return res.send(JSON.stringify(actionRequiredComponents));
                }
            });
        });
    });
}

module.exports = requiredScans;
