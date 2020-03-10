const mongoose = require('mongoose');
const moment = require('moment');

const Scan = require("../../../mongodb/schema/Scan");

function lineChart(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    let startDate = moment(req.params.startDate).tz("Europe/Berlin");
    let endDate = moment(req.params.endDate).tz("Europe/Berlin");

    let filter = {
        equipmentId: req.params.equipmentId,
        time: {
            $gte: moment(req.params.startDate).tz("Europe/Berlin").toDate(),
            $lte: moment(req.params.endDate).tz("Europe/Berlin").toDate()
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
}

module.exports = lineChart;