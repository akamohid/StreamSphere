const jwt= require("jsonwebtoken");
require("dotenv").config();

const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if(!authHeader)return res.sendStatus(401);
    const token=authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Token is missing" });
    }
    jwt.verify(
        token,
        process.env.ACCESS_SECRET_TOKEN,
        (err,decode)=>{
            if(err)return res.sendStatus(403);
            req.email=decode.email;
            next();
        }
    )
}
module.exports=verifyJWT;