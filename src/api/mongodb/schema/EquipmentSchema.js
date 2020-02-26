const mongoose = require('mongoose');

let equipmentSchema = mongoose.Schema({
    identifier: {type: String, required: true},
    image: String,
    parts: [{
        identifier: {type: String, required: true},
        image: String,
        description: String,
        order: {type: Number, required: true}
    }]
});

module.exports = equipmentSchema;