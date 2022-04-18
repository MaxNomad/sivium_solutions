const jwt = require('jsonwebtoken'),
secret = require('../config/env.config')['jwt_secret'];
const ADMIN_PERMISSION = require('../config/env.config')['permissionLevels']['ADMIN'];

exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.permissionLevel);
        if (user_permission_level & required_permission_level) {
            return next();
        } else {
            return res.status(403).send({ error_details: {name: "PermissionDeny", message: "You do not have permissions", statusCode: res.statusCode, error: "Forbidden"} });
        }
    };
};

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    } else {
        if (user_permission_level & ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send({ error_details: {name: "PermissionDeny", message: "You do not have permissions", statusCode: res.statusCode, error: "Forbidden"} });
        }
    }

};

exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;
    if (req.params.userId !== userId) {
        return next();
    } else {
        return res.status(403).send({ error_details: {name: "PermissionDeny", message: "You do not have permissions", statusCode: res.statusCode, error: "Forbidden"} });
    }
};
