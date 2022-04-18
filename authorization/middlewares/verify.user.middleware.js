const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');


exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user)=>{
            if(!user[0]){
                return res.status(400).send({ error_details: {name: "InvalidCredentials", message: "Invalid e-mail or password", statusCode: res.statusCode, error: "Bad Request"} });
                
            }else{
                let passwordFields = user[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user[0]._id,
                        email: user[0].email,
                        permissionLevel: user[0].permissionLevel,
                        provider: 'email',
                        name: user[0].firstName + ' ' + user[0].lastName,
                    };
                    return next();
                } else {
                    return res.status(400).send({ error_details: {name: "InvalidCredentials", message: "Invalid e-mail or password", statusCode: res.statusCode, error: "Bad Request"} });
                }
            }
        });
};
exports.check2FA = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user)=>{
            if(user[0].enable2FA){
                return res.status(401).send({ error_details: {name: "2FAEnabled", message: "2FAEnabled", statusCode: res.statusCode, error: "Unauthorized"} });
            }
            else{
                next()
            }


        
        });
};