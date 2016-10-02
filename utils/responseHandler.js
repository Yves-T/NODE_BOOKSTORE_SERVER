module.exports = function (res, status, data, message, err) {

    const respObj = {
        error: err,
        data: data,
        message: message
    };

    res.status(status);
    return res.json(respObj);
};
