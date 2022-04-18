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
        res.status(201).send({accessToken: token, refreshToken: refresh_token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({id: token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};
exports.verifyJWTtoken = (req, res, next) => {
    try {
        let accessToken = req.headers['authorization'].split(' ')[1];
        if(!TokenModel.findTokens({accessToken: accessToken})){
            next();
        }else{
            res.status(404).send();
        }
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.JWTLogout = (req, res, next) => {
    try {
    let accessToken = req.headers['authorization'].split(' ')[1];
    let refreshToken = req.body.refresh_token;
    if(!TokenModel.findTokens({accessToken: accessToken})){
        TokenModel.addBlacklist({accessToken: accessToken})
        res.status(200).send();
    }
    else{
        res.status(404).send();
    }

} catch (err) {
    res.status(500).send({errors: err});
}
    
};