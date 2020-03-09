const mongoose = require('mongoose');
const Scan = require("../../mongodb/schema/Scan");

function scans(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.find().lean().exec(function (err, scans) {
        return res.send(JSON.stringify(scans));
    });
}

module.exports = scans;