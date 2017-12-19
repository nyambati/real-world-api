const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const errorhandler = require('errorhandler');
const session = require('express-session');

const connectToDatabase = require('config/database');
const { nodeEnv, databaseUrl, secreKey } = require('config/environment').env;

const app = express();

// middlewares
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(session({
    secret: secreKey,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
// connect to the database

connectToDatabase(mongoose, databaseUrl);
require('models');

app.use(require('routes'));


app.get('/*', (req, res) => {
    return res.sendFile('index.html', {
        root: 'public'
    });
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (nodeEnv !== 'production') {
    app.use(errorhandler())
    //set mongoose to debug mode
    mongoose.set('debug', true)
    // development error handler
    app.use((err, req, res, next) => {
        console.log(err.stack);
        return res.status(err.status || 500)
            .json({
                'errors': {
                    message: err.message,
                    error: err
                }
            });
    });
}

app.use((err, req, res, next) => {
    return res.status(err.status || 500)
        .json({
            'errors': {
                message: err.message,
                error: {}
            }
        });
});


module.exports = app;
