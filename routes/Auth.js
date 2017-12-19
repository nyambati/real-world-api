const jwt = require('express-jwt');
const { secretKey } = require('config/environment').env;

const getTokenFromHeader = (req) => {
    if (
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        console.log('Bearer', req.headers.authorization)
        return req.headers.authorization.split(' ')[1]
    }
    return null;
}

const auth = {
    required: jwt({
        secret: secretKey,
        userProperty: 'payload',
        getToken: getTokenFromHeader
    }),
    optional: jwt({
        secret: secretKey,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    })
};

module.exports = auth;
