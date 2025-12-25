const express = require("express");
const Comment = require("../Model/Comments");
const Video = require("../Model/Video");

const router = express.Router();


//Get Comment for a video
// http://localhost:5000/comment/id  here the id is video_id

router.get("/:id",async (req,res)=>{
    try {
        const video_id=req.params.id;
        const comments=await  Comment.find({video_id}).populate("user_id", "channelImageURL channelName");
        return res.status(200).send(comments);
    } catch (error) {
        console.error({error});
    }
});

//Like Video
// http://localhost:5000/comment/id    here the id is video_id
router.post("/:id", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const comment=req.body.comment;
        if(!comment)
            return res.status(400).send({ message: "Please add a comment" });
        const video_id = req.params.id;
        if(!video_id){
            return res.status(400).send({ message: "Invalid Video" });
        }
        const video=await Video.findById(video_id);
        
        const comments=new Comment({user_id,video_id,comment});
        await comments.populate("user_id", "channelImageURL channelName");
        await comments.save();
        video.comments+=1;
        await video.save();
        return res.status(200).send(comments);
    } catch (err) {
        return res.status(500).send({ error: "Error while adding the comment" });
    }
});


//UN-Like Video
// http://localhost:5000/comment/delete/id      here the id is comment_id
router.delete("/delete/:id", async (req, res) => {
    try {
        const commentId = req.params.id;
        const commentDB=await Comment.findById(commentId);
        const video=await Video.findById(commentDB.video_id);
        const userId = req.body.user_id;
        const comment = await Comment.findOne({ _id: commentId, user_id: userId });
        if (!comment) {
            return res.status(404).send({ error: "Comment not found or not authorized" });
        }
        video.comments-=1;
        await video.save();
        await Comment.deleteOne({ _id: commentId });
        return res.status(200).send({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Error while deleting comment" });
    }
});

module.exports=router;