const jwtSecret = require('../../common/config/env.config.js').jwt_secret,
    jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uuid = require('uuid');
const TokenModel = require('../../authorization/models/token.model');
exports.login = (req, res) => {
    try {
        let refreshId = req.body.userId + jwtSecret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let b = Buffer.from(hash);
        let refresh_token = b.toString('base64');
        res.status(200).send({ accessToken: token, refreshToken: refresh_token });
    } catch (err) {
        return res.status(500).send({ error_details: { name: "ServerError", message: err, statusCode: res.statusCode, error: "Internal Server Error" } });
    }
};

exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({ id: token });
    } catch (err) {
        return res.status(500).send({ error_details: { name: "ServerError", message: err, statusCode: res.statusCode, error: "Internal Server Error" } });
    }
};

exports.verifyJWTBlacklist = (req, res, next) => {
    try {
        let accessToken = req.headers['authorization'].split(' ')[1];
        TokenModel.findTokens({ accessToken: accessToken }).then((result) => {
            if (!result) {
                next();
            } else {
                return res.status(400).send({ error_details: { name: "TokenInBlackList", message: "Access token blacklisted", statusCode: res.statusCode, error: "Bad Request" } });

            }
        });
    } catch (err) {
        return res.status(500).send({ error_details: { name: "ServerError", message: err, statusCode: res.statusCode, error: "Internal Server Error" } });
    }
};

exports.JWTLogout = (req, res, next) => {
    try {
        let accessToken = req.headers['authorization'].split(' ')[1];
        TokenModel.findTokens({ accessToken: accessToken }).then((result) => {
            if (!result) {
                TokenModel.addBlacklist({ accessToken: accessToken })
                res.status(200).send();
            } else {
                return res.status(400).send({ error_details: { name: "TokenInBlackList", message: "Access token blacklisted", statusCode: res.statusCode, error: "Bad Request" } });

            }

        });
    } catch (err) {
        return res.status(500).send({ error_details: { name: "ServerError", message: err, statusCode: res.statusCode, error: "Internal Server Error" } });
    }

};