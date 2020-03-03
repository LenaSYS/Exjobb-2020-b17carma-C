const mongoose = require('mongoose');

let componentStepSchema = new mongoose.Schema({
    equipment: {type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true},
    component: {type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true},
    identifier: {type: String, required: true},
    order: {type: Number, required: true},
    image: String,
    description: {type: String, required: true}
});

const ComponentStep = mongoose.model("ComponentStep", componentStepSchema, "componentsteps");

module.exports = ComponentStep;