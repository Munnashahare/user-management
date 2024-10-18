const mongoose = require('mongoose');
const { config } = require('./config');
const dbUrl = process.env.DBURL || config.dbUrl;

exports.dbConnection = () => {
    mongoose.connect(dbUrl).then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log("Error while connecting Database");
    })
}