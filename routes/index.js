const MainRouter = require('express').Router();
const UserRouter = require('./users/users.routes');


MainRouter.use(UserRouter);

module.exports = MainRouter;
