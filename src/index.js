const express = require('express');
const cors = require('cors');
const equipment = require('./api/routes/equipment');
const parts = require('./api/routes/components');
const scan = require('./api/routes/scan');
const analytics = require('./api/routes/analytics');
const sample = require('./api/routes/sample');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal server error')
});

app.use('/equipment', equipment);
app.use('/components', parts);
app.use('/scan', scan);
app.use('/analytics', analytics);
app.use('/sample', sample);

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
