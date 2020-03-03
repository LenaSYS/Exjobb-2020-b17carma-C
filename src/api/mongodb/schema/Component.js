const mongoose = require('mongoose');

let componentSchema = new mongoose.Schema({
    equipment: {type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true},
    identifier: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    frequency: {type: Number, required: true}, //How many times in a given time period
    frequencyType: {type: Number, min: 0, max: 3, required: true}, //How many times of what (0=day, 1=week, 2=month, 3=year)
    frequencyDays: [{type: Number, min: 1, max: 7}], //Which days of the week may a scan be carried out on? Not specified: all days
    lastScan: {type: mongoose.Schema.Types.ObjectId, ref: 'Scan'}
});

const Component = mongoose.model("Component", componentSchema, "components");

module.exports = Component;