const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String },
    permissionLevel: { type: Number },
    secureKey: { type: String, default: null },
    register: { type: Date, default: Date.now },
    lastLoginIP : { type: String , default: null },
    userCountry: { type: String },
    userAdress: { type: String },
    userPostal: { type: String },
    enable2FA: { type: Boolean, default: false },
    projectsID: [Schema.Types.Mixed],
    metamaskAdress: { type: String , default: null },
    userCryptoBalance: {type: Number, default: 0 }


});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});


userSchema.set('toJSON', {
    virtuals: true
});

userSchema.findById = function (cb) {
    return this.model('Users').find({ id: this.id }, cb);
};

const User = mongoose.model('Users', userSchema);


exports.findByEmail = (email) => {
    return User.find({ email: email });
};

exports.findUserByEmail = (email) => {
    return User.findOne({email: email})
        .then((result) => {
            return result ? true : false;
        });
};

exports.findById = (id) => {
    return User.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id
    }, userData);
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteMany({ _id: userId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

