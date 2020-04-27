const Equipment = require("../../mongodb/schema/Equipment");

function equipmentList(req, res) {
    Equipment.find().exec(function(err, equipment) {
        if (err)
            return console.log(err);

        return res.send(JSON.stringify(equipment));
    });
}

module.exports = equipmentList;
