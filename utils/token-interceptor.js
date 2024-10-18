const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const user = require("../models/user");

exports.interceptor = async (req, res, next) => {
    try {
        const {
            headers: {
                authorization: headerToken,
                'x-access-token': headerXAccessToken
            },
            body: {
                token: bodyToken
            },
            path
        } = req;

        if (config.excludedRoutes.indexOf(path) !== -1) {
            return next();
        }

        let token = bodyToken || headerXAccessToken || headerToken;

        if (!token) {
            return res.status(400).send({ success: false, message: "No token is provided" });
        }

        token = token.replace('Bearer ', '');
        let secretKey = process.env.SECRET_KEY || config.secreteKey;
        let decoded = await jwt.verify(token, secretKey);
        let userDetails = await user.fetchUserById(decoded.id);

        if (!userDetails) {
            return res.status(400).send({ success: false, message: "User not found" });
        }

        req.user = userDetails;
        return next();
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Token is not valid" });
    }
}