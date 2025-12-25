const express=require("express");
const Playlist=require("../Model/PlayList");
const Video = require('../Model/Video');
const router=express.Router();

//Get All Playlist
// URL http://localhost:5000/playlist/id      here the id is user_id
router.get("/:id", async (req,res)=>{
    try{
        const user_id=req.params.id;
        const playlist=await Playlist.find({user_id});
        return res.status(200).send(playlist)
    }catch(err){
        return res.status(500).send({error:"Error while displaying the playlis"});
    }
});


//Get All videos of playlist
// URL http://localhost:5000/playlist/video/id      here the id is playlist_id
router.get("/video/:id", async (req, res) => {
  try {
    const playlist_id = req.params.id;
    const playlist = await Playlist.findById(playlist_id);

    if (!playlist) {
      return res.status(404).send({ error: "Playlist not found" });
    }

    const videos = await Video.find({ _id: { $in: playlist.video_id } });

    return res.status(200).send({
      playlist: {
        _id: playlist._id,
        name: playlist.name,
        user_id: playlist.user_id,
        video_ids: playlist.video_id,
      },
      videos,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Error while displaying the playlist" });
  }
});

//Create Playlist
// URL http://localhost:5000/playlist/create
router.post("/create", async (req,res)=>{
    try{
        const playlist=new Playlist(req.body);
        await playlist.save();
        return res.status(200).send({message:"Playlist created successfully"})
    }catch(err){
        return res.status(500).send({error:"Error while creating the playlis"});
    }
  
});


//Add Videos
// http://localhost:5000/playlist/add/id
router.put("/add/:id", async (req, res) => {
    try {
        const playlist_id = req.params.id;
        const { video_id,name } = req.body; 
        if (!playlist_id) {
            return res.status(400).send({ error: "No Playlist ID provided" });
        }
        if (!video_id) {
            return res.status(400).send({ error: "No Video ID provided" });
        }
        const playlist = await Playlist.findById(playlist_id);
        if (!playlist) {
            return res.status(404).send({ error: "Playlist not found" });
        }
        playlist.video_id.forEach(element => {
            if(element==video_id)
                return res.status(500).send({message:"Video already present in playlist"});
        });
        if(name){
            playlist.name=name;
        }
        playlist.video_id.push(video_id);
        await playlist.save();
        res.status(200).send({ message: "Video added to playlist successfully", playlist });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Something went wrong" });
    } 
});


//Delete Playlist
// URL http://localhost:5000/playlist/delete/id
router.delete("/delete/:id", async (req,res)=>{
    try{
        const playlist=await Playlist.findByIdAndDelete(req.params.id);
        if(playlist){
        return res.status(200).send({message:"Playlist deleted successfully"});
        }else{
        return res.status(500).send({message:"Internal Error while deleting the playlist"});
        }
    }catch(err){
        return res.status(500).send({error:"Bad Request"});
    }
  
});
module.exports=router;