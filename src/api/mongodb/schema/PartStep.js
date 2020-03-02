const mongoose = require('mongoose');

let partStepSchema = mongoose.Schema({
    equipment: {type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true},
    part: {type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true},
    identifier: {type: String, required: true},
    image: String,
    description: {type: String, required: true}
});

const Part = mongoose.model("PartStep", partStepSchema, "partsteps");

module.exports = Part;