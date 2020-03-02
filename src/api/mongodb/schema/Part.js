const mongoose = require('mongoose');

let partSchema = new mongoose.Schema({
    equipment: {type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true},
    identifier: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    lastScan: {type: mongoose.Schema.Types.ObjectId, ref: 'Scan'}
});

const Part = mongoose.model("Part", partSchema, "parts");

module.exports = Part;