const express = require('express');

const equipment = require('./api/routes/equipment');
const parts = require('./api/routes/parts');

const app = express();
const port = 3001;

app.use('/equipment', equipment);
app.use('/parts', parts);

app.listen(port, () => console.log(`Scanner server listening on port ${port}`));