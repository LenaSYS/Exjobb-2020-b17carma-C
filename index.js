const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost/scanner', {useNewUrlParser: true});

let schema = mongoose.Schema({name: String, test: Number});
let Model = mongoose.model("Scan", schema, "scans");

app.get('/', function (req, res) {

    res.send("hello world")
});

app.get('/save', function (req, res) {
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("open?")
    });

    let scan1 = new Model({name: "hello", test: 1});

    scan1.save(function (err, scan) {
        if (err)
            return console.error("couldn't save");
        console.log(scan.name + " was successfully saved");
    });
    res.send('Saved!')
});
app.get('/fetch', function(req, res) {
    Model.find().lean().exec(function (err, scans) {
       return res.send(JSON.stringify(scans));
    });
});

app.listen(port, () => console.log(`Scanner server listening on port ${port}`));