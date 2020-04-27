const Scan = require("../../../mongodb/schema/Scan");

function pieChart(req, res) {
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
                name: 'Normal',
                value: successCount,
                color: "hsl(122, 39%, 49%)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15,
            },
            {
                id: 'Faults',
                label: 'Faults',
                name: 'Faults',
                value: failureCount,
                color: "hsl(4, 90%, 58%)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
        ];

        return res.send(JSON.stringify(data));
    });
}

module.exports = pieChart;
