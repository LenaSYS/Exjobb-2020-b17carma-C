const mongoose = require('mongoose');

let equipmentSchema = mongoose.Schema({
    identifier: {type: String, required: true},
    image: {type: String, required: true},
    parts: [{
        identifier: {type: String, required: true},
        image: {type: String, required: true},
        description: {type: String, required: true},
    }]
});

module.exports = equipmentSchema;