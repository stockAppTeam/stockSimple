const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    name: {
        type: String,
        unique: false, 
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ofAge: {
        type: Boolean, 
        required: true, 
        default: false
    },
    // Save the ObjectId for related collections. 'ref' is to the model it refers to
    watchlists: [{
        type: Schema.Types.ObjectId,
        ref: "Watchlists"
    }],
    articles: [{
        type: Schema.Types.ObjectId,
        ref: "Articles"
    }],
    investments: [{
        type: Schema.Types.ObjectId,
        ref: "Investments"
    }]
});

// Functions on the user schema for hashing the password and comparing it when the user logs in
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);