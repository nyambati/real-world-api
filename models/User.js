const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { sign } = require('jsonwebtoken');
const { randomBytes, pbkdf2Sync } = require('crypto');

const Schema = mongoose.Schema;
const { secretKey } = require('config/environment').env;

const UserSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    bio: String,
    image: {
        type: String,
        default: 'https://static.productionready.io/images/smiley-cyrus.jpg'
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    hash: String,
    salt: String
},
    { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

UserSchema.methods.validPassword = function (password) {
    const hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash = hash;
}

UserSchema.methods.setPassword = function (password) {
    this.salt = randomBytes(16).toString('hex');
    this.hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.generateJwtToken = function () {
    const today = new Date();
    const expiration = new Date(today);

    expiration.setDate(today.getDate() + 60);

    return sign(
        { id: this.id, username: this.username, exp: parseInt(expiration.getTime() / 1000) },
        secretKey
    );
}

UserSchema.methods.toAuthJSON = function () {
    const { username, email, bio, image } = this;
    return { username, email, bio, image, token: this.generateJwtToken() };
}

UserSchema.methods.toProfileJSONFor = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user ? user.isFollowing(this._id) : false
    }
}

UserSchema.methods.favorite = function (id) {
    if (!this.favorites.includes(id)) {
        this.favorites = [...this.favorites, id];
    }
    return this.save();
}

UserSchema.methods.unfavorite = function (id) {
    this.favorites.remove(id);
    return this.save();
}

UserSchema.methods.isFavorite = function (id) {
    return this.favorites.some(favoriteId => favoriteId.toString === id.toString());
}

UserSchema.methods.follow = function (id) {
    if (!this.following.includes(id)) {
        this.favorites = [...this.favorites, id];
    }
    return this.save();
}

UserSchema.methods.unfollow = function (id) {
    this.following.remove(id);
    return this.save();
}

UserSchema.methods.isFollowing = function (id) {
    return this.following.some(followId => followId.toString() === id.toString());
}

module.exports = mongoose.model('User', UserSchema);

