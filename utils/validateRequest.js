const jwt = require('jwt-simple');
const validate = require('../routes/auth.js').validate;
const respHandler = require('../utils/responseHandler.js');

module.exports = function (req, res, next) {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token && key) {

        try {
            var decoded = jwt.decode(token, require('../utils/secret.js'));

            if (decoded.exp <= Date.now()) {
                // res, status, data, message, err
                respHandler(res, 400, null, 'Token Expired', 'Token Expired');
                return;
            }
            var reqUser = decoded.user;

            // user `A` is using user `B`'s token if the below
            // condition fails.
            if (reqUser.email !== key) {
                // res, status, data, message, err
                respHandler(res, 401, null, 'Invalid Token or Key', 'Invalid Token or Key');

            } else {
                validate(reqUser._id, function (err, user) {
                    if (err) {
                        // res, status, data, message, err
                        respHandler(res, 500, null, 'Oops, something went wrong!', 'Oops, something went wrong!');

                    } else {
                        if (!user) {
                            // res, status, data, message, err
                            respHandler(res, 400, null, 'Invalid User', 'Invalid User');

                        } else {
                            next();
                        }
                    }
                });
            }
        } catch (err) {
            // res, status, data, message, err
            respHandler(res, 500, null, 'Oops, something went wrong!', 'Oops, something went wrong!');

        }
    } else {
        // res, status, data, message, err
        respHandler(res, 401, null, 'Invalid Token or Key', 'Invalid Token or Key');

    }
};
