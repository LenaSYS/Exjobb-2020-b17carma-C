const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let scanSchema = mongoose.Schema({
    equipment: {type: Schema.Types.ObjectId, required: true},
    part: {type: Schema.Types.ObjectId, required: true},
    status: Boolean,
    time: {type: Schema.Types.Date, required: true}
});

module.exports = scanSchema;