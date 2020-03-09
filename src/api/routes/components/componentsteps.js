const mongoose = require('mongoose');
const ComponentStep = require("../../mongodb/schema/ComponentStep");

function componentSteps(req, res) {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});

    ComponentStep.find({equipment: req.params.equipmentId, component: req.params.componentId}).sort('order').lean().exec(function (err, steps) {
        if (steps == null)
            return res.send([]);

        return res.send(JSON.stringify(steps));
    });
}

module.exports = componentSteps;