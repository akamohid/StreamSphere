const express = require("express");
const Rating = require("../Model/Rating");
const Video = require("../Model/Video");

const router = express.Router();


//Add rating
//URL http://localhost:5000/rating/id     id is video id
router.post("/:id",async (req,res)=>{
    try {
        const video_id=req.params.id;
        const videoExisted=await Video.findById(video_id);
        if(!videoExisted)
            return res.status(500).send({error:"Video does not exist"});
        const user_id=req.body.user_id;
        const count =req.body.count;
        let rating=await Rating.findOne({video_id});
        if(!rating){
            rating =new Rating({video_id:video_id, ratings:{user_id:user_id,count:count}});
        }
        const existing=rating.ratings.find(x=>x.user_id.toString()===user_id);
        if(existing){
            existing.count=count;
        }else{
            rating.ratings.push({user_id,count});
        }
        await rating.save();
        return res.status(200).send({ message: "Rating saved successfully" });
    } catch (error) {
        return res.status(400).send({error});
    }
});

module.exports=router;