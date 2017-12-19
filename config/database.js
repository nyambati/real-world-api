/* eslint-disable no-console */
module.exports = (mongoose, databaseUrl) => {
    mongoose.connect(databaseUrl, {
        useMongoClient: true,
    });
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
        console.log('Connecton to mongo database established');
    });

    mongoose.connection.on('error', (err) => {
        console.log('Mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose disconnected through app termination');
            process.exit(0);
        });
    });
};
