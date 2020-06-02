require('dotenv').config();

module.exports = {
    "development": {
        "username": "tester",
        "password": process.env.SEQUELIZE_PASSWORD,
        "database": "map",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "operatorsAliases": false
    },
    "production": {
        "username": "tester",
        "password": process.env.SEQUELIZE_PASSWORD,
        "database": "map",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "operatorsAliases": false,
        "logging": false,
    },
}
