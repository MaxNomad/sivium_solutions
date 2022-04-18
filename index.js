const config = require('./common/config/env.config.js');

const express = require('express');
const router = express.Router();
const app = express();
const {ValidationError} = require('express-validation')
const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(express.json());

app.use('/api/v1', router);
AuthorizationRouter.routesConfig(router);
UsersRouter.routesConfig(router);
app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({error_details: err})
    }
    return res.status(500).json({error_details: err})
  })

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
