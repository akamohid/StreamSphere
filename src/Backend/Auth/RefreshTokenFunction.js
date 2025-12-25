const jwt=require('jsonwebtoken');
const {GenerateAccessToken}=require("./GenerateToken");
const User=require("../Model/User")

 async function handleRefreshToken(req,res){
    try{
        const cookie=req.cookies;
        if(!cookie?.jwt)return res.sendStatus(401);
        const refreshToken=cookie.jwt;
        const findUser=await User.findOne({refreshToken:refreshToken});
        if(!findUser)return res.sendStatus(403);
        jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_TOKEN,
            (err,decode)=>{
                if(err)return res.sendStatus(403);
                const email=decode.email;
                const accessToken=GenerateAccessToken(email);
                return res.status(200).json({ accessToken });
            }
        )
    }catch(err){
        return res.sendStatus(500);
        
    }
}

module.exports=handleRefreshToken;