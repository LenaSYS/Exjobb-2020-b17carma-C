const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Schema = mongoose.Schema;

const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true, useUnifiedTopology: true});

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

let scanSchema = mongoose.Schema({
    equipment: {type: Schema.Types.ObjectId, required: true},
    part: {type: Schema.Types.ObjectId, required: true},
    status: Boolean,
    time: {type: Schema.Types.Date, required: true}
});

let EquipmentModel = mongoose.model("Equipment", equipmentSchema, "equipment");

app.get('/', function (req, res) {
    res.send("Hello World " + req.query.hello)
});

app.get('/parts/:equipmentId', cors(), function(req, res) {
   EquipmentModel.findOne({_id: req.params.equipmentId}).exec(function (err, equipment) {
       if (equipment == null)
           return res.send([{}]);

       return res.send(JSON.stringify(equipment.parts));
   });
});

app.get('/parts/:equipmentId/:partId', cors(), function(req, res) {
    EquipmentModel.findOne({_id: req.params.equipmentId}).exec(function (err, equipment) {
        if (equipment == null)
            return res.send([{}]);

        return res.send(JSON.stringify(equipment.parts.id(req.params.partId)));
    });
});

app.get('/equipment', cors(), function (req, res) {
    EquipmentModel.find().lean().exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

app.get('/equipment/:equipmentId', cors(), function (req, res) {
    EquipmentModel.findOne({_id: req.params.equipmentId}).lean().exec(function (err, equipment) {
        return res.send(JSON.stringify(equipment));
    });
});

app.get('/createsample', cors(), function (req, res) {
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("open?")
    });

    let testEquipmentModel = new EquipmentModel({
        _id: new mongoose.Types.ObjectId(),
        identifier: "Machine 1",
        image: "machine.jpg",
        parts: [
            {
                identifier: "Sample Part 1",
                image: "machine.jpg",
                description: "A sample part which is supposed to look like a sample part.",
                order: 1
            },
            {
                identifier: "Sample Part 2",
                image: "machine.jpg",
                description: "A sample part which is supposed to look like a sample part.",
                order: 2
            }
        ]
    });

    testEquipmentModel.save(function (err, equipment) {
        if (err)
            return console.error("couldn't save");
        console.log(equipment.identifier + " was successfully saved");
    });

    res.send('Saved!')
});

app.listen(port, () => console.log(`Scanner server listening on port ${port}`));