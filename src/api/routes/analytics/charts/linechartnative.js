const mongoose = require('mongoose');
const moment = require('moment-timezone');

const Scan = require("../../../mongodb/schema/Scan");

function lineChart(req, res) {
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

    let container = {
        labels: [],
        datasets: [
            { //Normal
                data: []
            },
            { //Faulty
                data: []
            }
        ]
    };

    Scan.find(filter).sort({time: 'ascending'}).lean().exec(function (err, scans) {
        for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'weeks')) {
            let currentDate = moment(m);
            let formattedWeek = m.day('Monday').format("DD/MM/YY");

            container.labels.push(formattedWeek);

            let matchingScans = scans.filter(x => moment(x.time).isSame(currentDate, 'week'));

            let numNormal = matchingScans.filter(scan => scan.status === true).length;
            let numFaulty = matchingScans.filter(scan => scan.status === false).length;

            container.datasets[0].data.push(numNormal);
            container.datasets[1].data.push(numFaulty);

        }
        return res.send(JSON.stringify(container));
    });
}

module.exports = lineChart;
