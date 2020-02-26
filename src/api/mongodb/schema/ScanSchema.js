const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let scanSchema = mongoose.Schema({
    equipmentId: {type: Schema.Types.ObjectId, required: true},
    partId: {type: Schema.Types.ObjectId, required: true},
    status: {type: Boolean, required: true},
    time: {type: Schema.Types.Date, required: true}
});

module.exports = scanSchema;