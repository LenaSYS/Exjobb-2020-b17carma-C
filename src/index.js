const express = require('express');

const equipment = require('./api/routes/equipment');
const parts = require('./api/routes/parts');

const app = express();

app.use('/equipment', equipment);
app.use('/parts', parts);

require('dotenv').config();

if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    app.listen(process.env.PORT, () => console.log(`Scanner server listening on port ${process.env.PORT}`));
} else if (process.env.ENVIRONMENT === 'PRODUCTION') {
    let fs = require('fs');
    let https = require('https');

    let privateKey = fs.readFileSync('/etc/letsencrypt/live/api.carlmaier.se/privkey.pem', 'utf8');
    let certificateKey = fs.readFileSync('/etc/letsencrypt/live/api.carlmaier.se/fullchain.pem', 'utf8');

    let credentials = {
        key: privateKey,
        cert: certificateKey
    };

    let server = https.createServer(credentials, app, () => console.log(`Scanner server listening on port ${process.env.PORT}`));
    server.listen(process.env.PORT);
}
