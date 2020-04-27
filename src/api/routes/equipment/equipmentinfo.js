const Equipment = require("../../mongodb/schema/Equipment");

function equipmentInfo(req, res) {
    Equipment.findOne({_id: req.params.equipmentId}).exec(function (err, equipment) {
        if (equipment == null)
            return res.send("[]");

        return res.send(JSON.stringify(equipment));
    });
}

module.exports = equipmentInfo;
