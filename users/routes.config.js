const UsersController = require('./controllers/users.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const FieldMiddleware = require('../common/middlewares/field.check.middleware');
const AuthorizationController = require('../authorization/controllers/authorization.controller');
const { validate } = require('express-validation')
const config = require('../common/config/env.config');

const Admin_Perm = config.permissionLevels.ADMIN;
const Worker_Perm = config.permissionLevels.WORKER;
const User_Perm = config.permissionLevels.USER;

exports.routesConfig = function (app) {


    app.post('/auth/sign-up',  [
        validate(FieldMiddleware.signUp),
        UsersController.checkUserExist,
        UsersController.insert,
        AuthorizationController.login
    ]);




    app.get('/users', [
        ValidationMiddleware.validJWTNeeded,
        AuthorizationController.verifyJWTBlacklist,
        PermissionMiddleware.minimumPermissionLevelRequired(User_Perm),
        UsersController.list
    ]);
    app.get('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        AuthorizationController.verifyJWTBlacklist,
        PermissionMiddleware.minimumPermissionLevelRequired(User_Perm),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.getById
    ]);
    app.patch('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        AuthorizationController.verifyJWTBlacklist,
        PermissionMiddleware.minimumPermissionLevelRequired(User_Perm),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.patchById
    ]);
    app.delete('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        AuthorizationController.verifyJWTBlacklist,
        PermissionMiddleware.minimumPermissionLevelRequired(Admin_Perm),
        UsersController.removeById
    ]);
    app.get('/user/:email', [
        ValidationMiddleware.validJWTNeeded,
        AuthorizationController.verifyJWTBlacklist,
        UsersController.checkUserExist
    ]);
};
