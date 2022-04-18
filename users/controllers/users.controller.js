const UserModel = require('../models/users.model');
const crypto = require('crypto');
const requestIp = require('request-ip');

exports.insert = (req, res, next) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;
    req.body.lastLoginIP =  requestIp.getClientIp(req) == "::1" ? "localhost": "::1";
    UserModel.createUser(req.body)
        .then((result) => {
            return next();
        });


};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.checkUserExist = (req, res, next) => {
    UserModel.findUserByEmail(req.body.email)
        .then((result) => {
            if (result) {
                res.status(400).send({ error_details: {name: "UserExist", message: "User exist", statusCode: res.statusCode, error: "Bad Request"} });
            } else {
                return next();

            }

        });
};

exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result) => {
            res.status(204).send({});
        });
};