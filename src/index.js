const express = require('express');
const cors = require('cors');
const equipment = require('./api/routes/equipment/equipment');
const components = require('./api/routes/components/components');
const scan = require('./api/routes/scan/scan');
const analytics = require('./api/routes/analytics/analytics');
const sample = require('./api/routes/sample/sample');
const dotenv = require('dotenv');
const moment = require('moment-timezone');

dotenv.config();
moment.tz.setDefault("Europe/Berlin");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/equipment', equipment);
app.use('/components', components);
app.use('/scan', scan);
app.use('/analytics', analytics);
app.use('/sample', sample);

if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    app.listen(process.env.PORT, () => console.log(`Scanner server listening on port ${process.env.PORT}`));
} else if (process.env.ENVIRONMENT === 'PRODUCTION') {
    const fs = require('fs');
    const https = require('https');

    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_LOCATION, 'utf8');
    const certificateKey = fs.readFileSync(process.env.CERTIFICATE_KEY_LOCATION, 'utf8');

    let credentials = {
        key: privateKey,
        cert: certificateKey
    };

    let server = https.createServer(credentials, app);
    server.listen(process.env.PORT, () => console.log(`Scanner server listening on port ${process.env.PORT}`));
}
