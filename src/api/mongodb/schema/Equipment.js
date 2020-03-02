const mongoose = require('mongoose');

let equipmentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    identifier: {type: String, required: true},
    image: {type: String, required: true}
});

let Equipment = mongoose.model("Equipment", equipmentSchema, "equipment");

module.exports = Equipment;