const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();

const Scan = require("../mongodb/schema/Scan");
const Component = require("../mongodb/schema/Component");

router.get('/stats', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let successCount = 0;
    let failureCount = 0;

    Scan.find().lean().exec(function (err, scans) {
        scans.map(function (scan) {
            if (scan.status)
                successCount++;
            else
                failureCount++;
        });

        const data = [
            {
                id: 'Normal',
                label: 'Normal',
                value: successCount,
                color: "hsl(122, 39%, 49%)"
            },
            {
                id: 'Faults',
                label: 'Faults',
                value: failureCount,
                color: "hsl(4, 90%, 58%)"
            }
        ];

        return res.send(JSON.stringify(data));
    });
});

router.get('/scans', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find().lean().exec(function (err, scans) {
        return res.send(JSON.stringify(scans));
    });
});

router.get('/scans/:equipmentId/:startDate/:endDate', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let startDate = moment(req.params.startDate);
    let endDate = moment(req.params.endDate);

    let filter = {
        equipmentId: req.params.equipmentId,
        time: {
            $gte: moment(req.params.startDate).toDate(),
            $lte: moment(req.params.endDate).toDate()
        },
    };

    let weeksFaulty = [];
    let weeksSuccess = [];

    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'weeks')) {
        let formattedWeek = m.day('Monday').format("DD/MM/YY");

        weeksFaulty.push({
            x: formattedWeek,
            y: 0
        });

        weeksSuccess.push({
            x: formattedWeek,
            y: 0
        })
    }

    Scan.find(filter).sort({time: 'ascending'}).lean().exec(function (err, scans) {
        scans.map(function (scan) {
            let formattedWeek = moment(scan.time).day('Monday').format("DD/MM/YY");
            let week = scan.status ? weeksSuccess.find(week => week.x === formattedWeek) : weeksFaulty.find(week => week.x === formattedWeek);

            week.y = week.y + 1;
        });

        let failureData = {
            id: 'Faults',
            data: weeksFaulty
        };

        let successData = {
            id: 'Normal',
            data: weeksSuccess
        };

        return res.send(JSON.stringify([successData, failureData]));
    });
});

router.get('/calendar', function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find().lean().exec(function (err, scans) {
        let days = [];

        scans.map(function (scan) {
            let formattedDay = moment(scan.time).format('YYYY-MM-DD').toString();

            if (days.filter(e => e.day === formattedDay).length > 0) {
                let day = days.find(x => x.day === formattedDay);
                day.value = day.value + 1;
            } else {
                days.push({
                    day: formattedDay,
                    value: 1
                })
            }
        });
        return res.send(JSON.stringify(days));
    });
});

router.get("/overview", function (req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Component.find().populate('equipment').lean().exec(function (err, components) {
        let actionRequiredComponents = [];

        let startDate = moment().startOf("month");
        let endDate = moment().endOf("month");

        for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
            let currentDate = moment(m);
            let currentDay = currentDate.day();
            let formattedDay = m.format("DD/MM/YY");

            actionRequiredComponents.push({
                date: formattedDay,
                data: []
            });

            components.map(function (component, i) {
                let frequency = component.frequency;
                let frequencyType = component.frequencyType;
                let frequencyDays = component.frequencyDays;
                let frequencyTypeString = frequencyType === 0 ? 'days' : frequencyType === 1 ? 'weeks' : frequencyType === 2 ? 'months' : frequencyType === 3 ? 'years' : null;
                let earliestScanDate = moment(currentDate).subtract(1, frequencyTypeString);
                let lastScanToday = component.lastScan !== undefined && moment(component.lastScan.time).isSame(currentDate, 'day');

                Scan.countDocuments(
                    {
                        equipment: component.equipment,
                        component: component._id,
                        time: {
                            $gte: moment(earliestScanDate).toDate(),
                            $lte: moment(currentDate).toDate()
                        },
                    }
                ).exec(function (err, count) {
                    if (err)
                        return console.log('err: ' + err);

                    if (count < frequency && !lastScanToday && (frequencyDays.length === 0 || frequencyDays.includes(currentDay))) {
                        actionRequiredComponents.find(x => x.date === formattedDay).data.push(component);
                    }

                    if (i === components.length - 1 && !moment(currentDate).add(1, 'days').isBefore(moment(endDate))) {
                        return res.send(JSON.stringify(actionRequiredComponents));
                    }
                });
            });
        }
    });
});

module.exports = router;