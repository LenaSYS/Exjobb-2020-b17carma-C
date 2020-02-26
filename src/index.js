const express = require('express');
const cors = require('cors');

const equipment = require('./api/routes/equipment');
const parts = require('./api/routes/parts');
const scan = require('./api/routes/scan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/equipment', equipment);
app.use('/parts', parts);
app.use('/scan', scan);

if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    app.listen(process.env.PORT, () => console.log(`Scanner server listening on port ${process.env.PORT}`));
} else if (process.env.ENVIRONMENT === 'PRODUCTION') {
    const fs = require('fs');
    const https = require('https');

    const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.carlmaier.se/privkey.pem', 'utf8');
    const certificateKey = fs.readFileSync('/etc/letsencrypt/live/api.carlmaier.se/fullchain.pem', 'utf8');

    let credentials = {
        key: privateKey,
        cert: certificateKey
    };

    let server = https.createServer(credentials, app);
    server.listen(process.env.PORT, () => console.log(`Scanner server listening on port ${process.env.PORT}`));
}
