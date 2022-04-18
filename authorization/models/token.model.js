const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    accessToken: { type: String },
    added: { type: Date, default: Date.now },
});

tokenSchema.virtual('id').get(function () {
    return this._id.toHexString();
});


tokenSchema.set('toJSON', {
    virtuals: true
});

tokenSchema.findById = function (cb) {
    return this.model('Blacklist').find({ id: this.id }, cb);
};

const Blacklist = mongoose.model('Blacklist', tokenSchema);


exports.findTokens = (accessToken) => {
    return Blacklist.findOne(accessToken)
        .then((result) => {
            return result ? true : false;
        });
};

exports.addBlacklist = (tokenData) => {
    const blacklist = new Blacklist(tokenData);
    return blacklist.save();
};


