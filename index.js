const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/save', (req, res) => res.send('Saved!'));
app.get('/fetch', (req, res) => res.send('{"test": 100}'));

app.listen(port, () => console.log(`Scanner server listening on port ${port}`));