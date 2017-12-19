
module.exports = {
    env: {
        databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost/warsha-real-world',
        nodeEnv: process.env.NODE_ENV || 'development',
        secretKey: process.env.SECRET_ENCRYPTION_KEY || 'app:bm90aGluZyBhZGRlZCB0byBjb21taXQK'
    }
}
