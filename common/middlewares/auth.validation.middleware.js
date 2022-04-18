const jwt = require('jsonwebtoken'),
    secret = require('../config/env.config.js').jwt_secret,
    crypto = require('crypto');

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {

        return res.status(400).send({ error_details: { name: "PassRefreshTokenField", message: "Need to pass refresh_token field", statusCode: res.statusCode, error: "Bad Request" } });
    }
};

exports.validRefreshNeeded = (req, res, next) => {
    let b = Buffer.from(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + secret).digest("base64");
    if (hash === refresh_token) {
        req.body = req.jwt;
        return next();
    } else {

        return res.status(400).send({ error_details: { name: "InvalidRefreshToken", message: "Invalid refresh token", statusCode: res.statusCode, error: "Bad Request" } });
    }
};


exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send({ error_details: { name: "BadToken", message: "Invalid token", statusCode: res.statusCode, error: "Unauthorized" } });
            } else {
                req.jwt = jwt.verify(authorization[1], secret);
                return next();
            }

        } catch (err) {
            return res.status(403).send({ error_details: { name: "BadToken", message: "Invalid token", statusCode: res.statusCode, error: "Forbidden" } });
        }
    } else {
        return res.status(401).send({ error_details: { name: "BadToken", message: "Invalid token", statusCode: res.statusCode, error: "Unauthorized" } });
    }
};