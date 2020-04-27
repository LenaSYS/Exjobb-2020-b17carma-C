const Scan = require("../../mongodb/schema/Scan");

function scans(req, res) {
    Scan.find().lean().exec(function (err, scans) {
        return res.send(JSON.stringify(scans));
    });
}

module.exports = scans;
