const mongoose = require('mongoose');
const Component = require("../../mongodb/schema/Component");
const Scan = require("../../mongodb/schema/Scan");

function scans(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    function randomDate(start, end, startHour, endHour) {
        let date = new Date(+start + Math.random() * (end - start));
        let hour = startHour + Math.random() * (endHour - startHour) | 0;
        date.setHours(hour);
        return date;
    }

    let i;
    for (i=0;i<1000;i++) {
        let scan = new Scan({
            equipmentId: '5e53f1c36c7df42438366bde',
            componentId: '5e53f1c36c7df42438366be0',
            status: Math.random() >= 0.5,
            time: randomDate(new Date(2020, 0), new Date(2020, 11), 0, 23)
        });

        scan.save(function (err) {
            if (err)
                return console.log("error saving sample equipment");

            const filter = {_id: scan.componentId, equipment: scan.equipmentId};
            const update = {lastScan: scan._id};

            Component.updateOne(filter, update, function(err, doc) {
                if (err)
                    console.log(err);
            });
        });
    }

    return res.send({"status": "created"});
}

module.exports = scans;