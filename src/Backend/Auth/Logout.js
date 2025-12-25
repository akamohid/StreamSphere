const User=require("../Model/User");
 async function handleLogout(req,res){
    try{
        const cookie=req.cookies;
        if(!cookie?.jwt)return res.sendStatus(401);
        const refreshToken=cookie.jwt;
        const findUser=await User.findOne({refreshToken:refreshToken});
        if(!findUser){
            res.clearCookie('jwt',{httpOnly:true, sameSite:'none', secure:true});
            return res.sendStatus(204);
        }
        
        findUser.refreshToken='';
        await findUser.save();
        res.clearCookie('jwt',{httpOnly:true, sameSite:'none', secure:true});
        return res.sendStatus(204);


    }catch(err){
        return res.sendStatus(500);
        
    }
}

module.exports=handleLogout;