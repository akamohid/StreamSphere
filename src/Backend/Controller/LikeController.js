const express = require("express");
const Likes = require("../Model/Likes");
const Video = require("../Model/Video");

const router = express.Router();

//Get Likes for a video
// http://localhost:5000/likes/id  here the id is video_id

router.get("/:id",async (req,res)=>{
    try {
        const video_id=req.params.id;
        const likes=await  Likes.find({video_id}).populate("user_id", "channelImageURL channelName");
        return res.status(200).send(likes);
    } catch (error) {
        console.error({error});
    }
});


//Like Video
// http://localhost:5000/like/id    here the id is video_id
router.post("/:id", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const video_id = req.params.id;
        const video=await Video.findById(video_id);
        const like=new Likes({user_id,video_id});
        if(video){
            video.likes+=1;
            await video.save();
            await like.save();
        }else{
            return res.status(500).send({ error: "No video found" });
        }
        return res.status(200).send({ message: "Video Liked successfully" })
    } catch (err) {
        return res.status(500).send({ error: "Error while Liking the video" });
    }
});


//UN-Like Video
// http://localhost:5000/like/unlike/id            here the id is video_id
router.delete("/unlike/:id", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const video_id = req.params.id;
        const video=await Video.findById(video_id);
        if(video){
            const like=await Likes.findOneAndDelete({user_id, video_id});
            video.likes-=1;
            await video.save();
        }
        return res.status(200).send({ message: "Video UnLiked successfully" })
    } catch (err) {
        return res.status(500).send({ error: "Error while unlvideoiking the " });
    }
});

module.exports=router;