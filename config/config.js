exports.config = {
    "dbUrl": "mongodb+srv://xyz:1234@cluster0.diaip.mongodb.net/User_Management?retryWrites=true&w=majority",
    "secreteKey": "secrete-key",
    "port": 3000,
    "excludedRoutes": [
        "/",
        "/api/register",
        "/api/login"
    ],
}