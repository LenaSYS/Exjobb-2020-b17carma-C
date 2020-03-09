const mongoose = require('mongoose');
const Equipment = require("../../mongodb/schema/Equipment");

function equipmentInfo(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    Equipment.findOne({_id: req.params.equipmentId}).exec(function (err, equipment) {
        if (equipment == null)
            return res.send("[]");

        return res.send(JSON.stringify(equipment));
    });
}

module.exports = equipmentInfo;