const { Sequelize } = require('sequelize');
require('dotenv').config({ quiet: true });

let sequelize;

if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database/uniskills_database.sqlite',
        logging: false
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'uniskills_db',
        process.env.DB_USER || 'root',
        process.env.DB_PASS || '',
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'mysql',
            logging: false
        }
    );
}

module.exports = sequelize;