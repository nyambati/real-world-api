const Router = require('express').Router();
const { create, login, findById, update } = require('./users.controllers');
const Auth = require('../Auth');

Router.route('/user')
    .get(Auth.required, findById)
    .put(Auth.required, update)

Router.post('/users/login', login);
Router.post('/users', create);

module.exports = Router;
