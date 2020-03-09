const mongoose = require('mongoose');
const Equipment = require("../../mongodb/schema/Equipment");

function equipmentList(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Equipment.find().exec(function(err, equipment) {
        if (err)
            return console.log(err);

        return res.send(JSON.stringify(equipment));
    });
}

module.exports = equipmentList;