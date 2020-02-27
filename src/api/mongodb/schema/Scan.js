const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let scanSchema = mongoose.Schema({
    equipmentId: {type: Schema.Types.ObjectId, ref: 'Equipment', required: true},
    partId: {type: Schema.Types.ObjectId, ref: 'Part', required: true},
    status: {type: Boolean, required: true},
    time: {type: Schema.Types.Date, required: true}
});

let Scan = mongoose.model("Scan", scanSchema, "scans");

module.exports = Scan;