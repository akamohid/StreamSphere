const jwt= require("jsonwebtoken");

function GenerateAccessToken(email) {
    if (!process.env.ACCESS_SECRET_TOKEN) {
        throw new Error("ACCESS_SECRET_TOKEN is not defined in environment variables");
    }

    return jwt.sign(
        { email: email },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: '30m' }
    );
}
function GenerateRefreshToken(email) {
    if (!process.env.REFRESH_SECRET_TOKEN) {
        throw new Error("REFRESH_SECRET_TOKEN is not defined in environment variables");
    }

    return jwt.sign(
        { email: email },
        process.env.REFRESH_SECRET_TOKEN,
        { expiresIn: '1d' }
    );
}

module.exports={GenerateAccessToken,GenerateRefreshToken};