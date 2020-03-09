const mongoose = require('mongoose');
const Equipment = require("../../mongodb/schema/Equipment");
const Component = require("../../mongodb/schema/Component");
const ComponentStep = require("../../mongodb/schema/ComponentStep");
const Scan = require("../../mongodb/schema/Scan");

function reset(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Scan.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    ComponentStep.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    Component.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    Equipment.deleteMany({}, function (err) {
        if (err)
            console.log(err);
    });

    return res.send({"status": "cleared"});
}

module.exports = reset;