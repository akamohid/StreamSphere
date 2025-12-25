const express=require("express");
const router=express.Router();
const RefreshToken=require("../Auth/RefreshTokenFunction");
const Logout=require("../Auth/Logout");


//Refresh Access Token
// URL https://localhost:5000/refresh
router.get("/",RefreshToken);


//Logout
// URL https://localhost:5000/logout
router.post("/",Logout);


module.exports=router;