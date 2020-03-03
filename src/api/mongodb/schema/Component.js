const mongoose = require('mongoose');

let componentSchema = new mongoose.Schema({
    equipment: {type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true},
    identifier: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    interval: {type: Number, required: true},
    intervalType: {type: Number, min: 0, max: 3, required: true},
    lastScan: {type: mongoose.Schema.Types.ObjectId, ref: 'Scan'}
});

const Component = mongoose.model("Component", componentSchema, "components");

module.exports = Component;