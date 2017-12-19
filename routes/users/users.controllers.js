const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');
const { hasRequiredProperties } = require('validators/core');

const create = (req, res, next) => {
    const errors = hasRequiredProperties(['username', 'email', 'password'], req.body.user);

    if (errors.length) {
        return res.status(422).json({ errors });
    }

    const user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save()
        .then(() => res.status(201).json({ user: user.toAuthJSON() }))
        .catch(next);
}

const login = (req, res, next) => {
    const errors = hasRequiredProperties(['email', 'password'], req.body.user);

    if (errors.length) {
        return res.status(422).json({ errors });
    }

    passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error)
            return next(error);

        if (!user)
            return res.status(422).json(info);

        user.token = user.generateJwtToken();
        return res.json({ user: user.toAuthJSON() })
    })(req, res, next);
}

const findById = (req, res, next) => {
    return User.findById(req.payload.id).then(user => {
        if (!user)
            return res.sendStatus(401);

        return res.json({ user: user.toAuthJSON() });
    }).catch(next);
}

const update = (req, res, next) => {
    const fields = Object.keys(req.body.user);
    return User.findById(req.payload.id).then(user => {

        for (field of fields) {
            if (field !== 'password') {
                user[field] = req.body.user[field];
            }
        }

        user.setPassword(req.body.user.password);

        return user.save().then(() => res.json({ user: user.toAuthJSON() }))
    }).catch(next);
}

module.exports = {
    create,
    findById,
    login,
    update
};
