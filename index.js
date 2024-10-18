const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { config } = require('./config/config');
const { dbConnection } = require('./config/db');
const { interceptor } = require('./utils/token-interceptor');
const userRouter = require('./routes/user');
require('dotenv').config();
const port = process.env.PORT || config.port;

const app = express();

dbConnection();

app.use(cors());
app.use(bodyParser.json());

// Token Interceptor
app.use((req, res, next) => {
    interceptor(req, res, next);
});

// Default Route
app.get("/", (req, res) => {
    return res.status(200).json({ success: true, message: "Welcome to User Maanagement Application....!!!" })
});

app.use('/api', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
