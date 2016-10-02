const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

const limiter = RateLimit({
    // window, delay, and max apply per-ip unless global is set to true
    windowMs: 60 * 1000, // miliseconds - how long to keep records of requests in memory
    delayMs: 1000, // milliseconds - base delay applied to the response - multiplied by number of recent hits from user's IP
    max: 100, // max number of recent connections during `window` miliseconds before (temporarily) bocking the user.
    global: false // if true, IP address is ignored and setting is applied equally to all requests
});

app.use(express.static(__dirname));

app.all('/*', function (req, res, next) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// disabled limited
app.all('/api/v1/user/*', [/*limiter ,*/ require('./utils/validateRequest')]);
app.use('/', require('./routes'));
// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// Start the server
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
