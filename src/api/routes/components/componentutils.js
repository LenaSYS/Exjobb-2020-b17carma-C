const moment = require('moment-timezone');

function addScanInfo(components) {
    components.forEach(function (component) {
        addComponentScanInfo(component);
    });
}

function addComponentScanInfo(component) {
    if (component.hasOwnProperty('lastScan')) { //Add last scan info in backend to reduce front-end overhead
        let scanMoment = moment(component.lastScan.time).tz("Europe/Berlin");
        let currentMoment = moment(new Date()).tz("Europe/Berlin");

        component.lastScanToday = currentMoment.isSame(scanMoment, 'day'); //Check if scan was made the same day as today
    } else {
        component.lastScanToday = false;
    }
}

module.exports.addScanInfo = addScanInfo;
module.exports.addComponentScanInfo = addComponentScanInfo;