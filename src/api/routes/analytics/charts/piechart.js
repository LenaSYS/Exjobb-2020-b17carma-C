const mongoose = require('mongoose');
const Scan = require("../../../mongodb/schema/Scan");

function pieChart(req, res) {
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
}

module.exports = pieChart;