const express = require("express");
const Histroy = require("../Model/Histroy");
const Video = require("../Model/Video");

const router = express.Router();


//Show all
// POST http://localhost:5000/histroy/
router.post("/", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const histroy = await Histroy.findOne({ user_id });
        if (!histroy) return res.status(200).send({ watchedVideos: [] });

        const videos = await Video.find({ _id: { $in: histroy.watchedVideos } });
        return res.status(200).send({ watchedVideos: videos });
    } catch (err) {
        return res.status(400).send({ error: "Bad request" });
    }
});



//ADD to Histroy
//URL http://localhost:5000/histroy/add/id       this is video_id
router.post("/add/:id", async (req, res) => {
    try {
        const video_id = req.params.id;
        const videoExists = await Video.findById(video_id);
        const user_id = req.body.user_id;
        if (videoExists) {
            let histroy = await Histroy.findOne({ user_id: user_id });
            if (!histroy) {
                histroy = new Histroy({ user_id: user_id, watchedVideos: [] });
            }
            histroy.watchedVideos=histroy.watchedVideos.filter(x=>x.toString()!=video_id);
            histroy.watchedVideos.push(video_id);
            await histroy.save();
             return res.status(200).send({ error: "Added to histroy" });

        }
        return res.status(500).send({ error: "Cannot add to histroy" });

    } catch (err) {
        return res.status(400).send({ error: "Bad Request" });
    }
});



//Remove from Histroy
//URL http://localhost:5000/histroy/remove/id       this is video_id
router.delete("/remove/:id", async (req, res) => {
    try {
        const video_id = req.params.id;
        const videoExists = await Video.findById(video_id);
        const user_id = req.body.user_id;
        if (!videoExists) {
            return res.status(500).send({error:"Video does not exists"}) ;
        }
        let histroy=await Histroy.findOne({user_id:user_id});
        if(!histroy){
            return res.status(500).send({error:"Nothing in watched Histroy"});
        }
        histroy.watchedVideos=histroy.watchedVideos.filter((x)=>{
            video_id!=x.toString();
        });
        await histroy.save();
        return res.status(200).send({ error: "Removed from histroy" });
    } catch (err) {
        return res.status(400).send({ error: "Bad Request" });
    }
});

module.exports = router;