const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/save', (req, res) => res.send('Saved!'));

app.listen(port, () => console.log(`Scanner server listening on port ${port}`));