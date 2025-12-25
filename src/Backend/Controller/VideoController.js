//Express Imports
const express = require("express");
const Video = require("../Model/Video");
const Comment = require("../Model/Comments");
const Likes = require("../Model/Likes");
const Histroy = require("../Model/Histroy");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { spawn } = require('child_process');
const os = require("os");

//AWS Imports
const { PutObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const S3 = require('../AWS/AWSConfig');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const bucketName = process.env.BUCKET_NAME;

//Multer imports
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500 * 1024 * 1024 },
}).fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

//Other imports
const crypto = require('crypto');
const sharp = require('sharp');



//Get all Videos
//URL http://localhost:5000/video/get-all

// router.get("/get-all", async (req, res) => {
//     try {
//         const videos = await Video.find().populate("user_id", "channelName channelImageURL");

//         const signedVideos = await Promise.all(
//             videos.map(async (video) => {
//                 if (!video.videoName) return video;

//                 // Generate signed video URL
//                 const getVideoUrl = new GetObjectCommand({
//                     Bucket: bucketName,
//                     Key: video.videoName,
//                 });
//                 const videoUrl = await getSignedUrl(S3, getVideoUrl, { expiresIn: 3600 });

//                 // Save URL to database
//                 video.URL = videoUrl;
//                 await video.save(); // saves updated URL to MongoDB

//                 // Generate signed channel image URL
//                 let imageUrl = "";
//                 if (video.user_id?.channelImageName) {
//                     const getImageUrl = new GetObjectCommand({
//                         Bucket: bucketName,
//                         Key: video.user_id.channelImageName,
//                     });
//                     imageUrl = await getSignedUrl(S3, getImageUrl, { expiresIn: 3600 });
//                 }

//                 return {
//                     ...video.toObject(),
//                     URL: videoUrl,
//                     channelName: video.user_id?.channelName || "Default",
//                     channelImageURL: imageUrl,
//                 };
//             })
//         );

//         res.status(200).send(signedVideos);
//     } catch (err) {
//         console.error(err);
//         res.status(400).send({ error: "Invalid Request" });
//     }
// });

router.get("/get-all", async (req, res) => {
    try {
        const video = await Video.find().populate("user_id", "channelName channelImageURL");
        res.status(200).send(video);
    } catch (err) {
        return res.status(400).send({ error: "InValid Request" })
    }
});

//Find all videos of USER
//URL http://localhost:5000/video/get

router.post("/get", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const video = await Video.find({ user_id });
        console.log(video);
        res.status(200).send({ video });
    } catch (err) {
        return res.status(400).send({ error: "InValid Request" })
    }
});


router.post("/add", upload, async (req, res) => {
    try {
        const videoData = JSON.parse(req.body.data);
        const videoFile = req.files.video[0];
        const thumbnailFile = req.files.thumbnail[0];
        const resizedBuffer = await sharp(thumbnailFile.buffer)
            .resize(1920, 1080) // Width: 320px, Height: 180px
            .toFormat('jpeg')
            .toBuffer();

        const randomName = (bytes = 8) => crypto.randomBytes(bytes).toString("hex");
        const fileId = randomName();
        const tempName = `${fileId}.mp4`;

        const uploadFolder = path.join(os.tmpdir(), fileId);
        fs.mkdirSync(uploadFolder, { recursive: true });

        const tempPath = path.join(uploadFolder, tempName);
        fs.writeFileSync(tempPath, videoFile.buffer);

        const hlsFolder = path.join(uploadFolder, "hls");
        fs.mkdirSync(hlsFolder, { recursive: true });

        const ffmpeg = spawn('ffmpeg', [
            '-i', tempPath,
            '-filter_complex', '[0:v]split=3[v1][v2][v3];[v1]scale=640:360[v360];[v2]scale=854:480[v480];[v3]scale=1280:720[v720]',
            '-map', '[v360]', '-map', 'a', '-c:v:0', 'libx264', '-b:v:0', '800k', '-c:a', 'aac',
            '-f', 'hls', '-hls_time', '5', '-hls_playlist_type', 'vod',
            '-hls_segment_filename', path.join(hlsFolder, '360p_%03d.ts'),
            path.join(hlsFolder, '360p.m3u8'),
            '-map', '[v480]', '-map', 'a', '-c:v:1', 'libx264', '-b:v:1', '1400k', '-c:a', 'aac',
            '-f', 'hls', '-hls_time', '5', '-hls_playlist_type', 'vod',
            '-hls_segment_filename', path.join(hlsFolder, '480p_%03d.ts'),
            path.join(hlsFolder, '480p.m3u8'),
            '-map', '[v720]', '-map', 'a', '-c:v:2', 'libx264', '-b:v:2', '2800k', '-c:a', 'aac',
            '-f', 'hls', '-hls_time', '5', '-hls_playlist_type', 'vod',
            '-hls_segment_filename', path.join(hlsFolder, '720p_%03d.ts'),
            path.join(hlsFolder, '720p.m3u8')
        ]);

        ffmpeg.on('close', async (code) => {
            if (code !== 0) {
                return res.status(500).send({ error: `FFmpeg failed with code ${code}` });
            }

            const outputMasterPlaylist = path.join(hlsFolder, "master.m3u8");
            const masterPlaylistContent = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n360p.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480\n480p.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\n720p.m3u8\n`;
            fs.writeFileSync(outputMasterPlaylist, masterPlaylistContent);

            const baseS3Key = `videos/${fileId}`;
            const uploadPromises = [];

            const files = fs.readdirSync(hlsFolder);
            files.forEach(file => {
                const filePath = path.join(hlsFolder, file);
                uploadPromises.push(
                    S3.send(new PutObjectCommand({
                        Bucket: bucketName,
                        Key: `${baseS3Key}/${file}`,
                        Body: fs.readFileSync(filePath),
                        ContentType: file.endsWith(".m3u8") ? "application/x-mpegURL" : "video/MP2T"
                    }))
                );
            });

            const thumbnailKey = `${baseS3Key}/thumbnail-${Date.now()}.jpg`;
            uploadPromises.push(
                S3.send(new PutObjectCommand({
                    Bucket: bucketName,
                    Key: thumbnailKey,
                    Body: resizedBuffer,
                    ContentType: thumbnailFile.mimetype
                }))
            );

            await Promise.all(uploadPromises);

            const video = new Video({
                ...videoData,
                videoName: `${baseS3Key}/master.m3u8`,
                URL: `https://${bucketName}.s3.amazonaws.com/${baseS3Key}/master.m3u8`,
                thumbnailName: thumbnailKey,
                thumbnailURL: `https://${bucketName}.s3.amazonaws.com/${thumbnailKey}`,
            });

            await video.save();
            fs.rmSync(uploadFolder, { recursive: true, force: true });

            res.status(200).send(video);
        });
    } catch (err) {
        console.error("HLS Upload Error:", err);
        return res.status(400).send({ error: "Video processing failed", message: err.message });
    }
});

//Delete Video
//URL http://localhost:5000/video/delete/id 

router.delete("/delete/:id", async (req, res) => {
    try {
        const video_id = req.params.id;
        const deleteVideo = await Video.findById(video_id);
        if (!deleteVideo) {
            return res.status(404).send({ message: "Video not found" });
        }

        // Extract path prefix
        const prefix = deleteVideo.videoName.split('/').slice(0, -1).join('/');

        // List all objects with the prefix
        const listParams = {
            Bucket: bucketName,
            Prefix: prefix + '/'
        };
        const listCommand = new ListObjectsV2Command(listParams);
        const listResponse = await S3.send(listCommand);

        if (listResponse.Contents.length === 0) {
            return res.status(404).send({ message: "No objects found in S3 to delete." });
        }

        // Prepare delete objects command
        const deleteParams = {
            Bucket: bucketName,
            Delete: {
                Objects: listResponse.Contents.map(obj => ({ Key: obj.Key }))
            }
        };

        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await S3.send(deleteCommand);

        // Delete from MongoDB
        await Video.deleteOne({ _id: video_id });
        await Comment.deleteMany({ video_id });
        await Likes.deleteMany({ video_id });

        return res.status(200).send({ message: "Video and related files deleted successfully." });
    } catch (err) {
        console.error("Error deleting video:", err);
        return res.sendStatus(400);
    }
});



//Update Video
//URL http://localhost:5000/video/update:id
router.put("/update/:id", async (req, res) => {
    try {
        const video_id = req.params.id;
        const updatedparameter = req.body;
        const updatedVideo = await Video.findByIdAndUpdate(
            video_id,
            updatedparameter,
            { new: true, runValidators: true }
        );
        if (updatedVideo) {
            return res.status(200).send({
                message: "Video updated successfully",
                data: updatedVideo
            });
        }
        else {
            return res.status(500).send({ message: "Error while updating video" });
        }
    } catch (err) {
        return res.status(400).send({ error: "Bad request" });
    }
});


//Increment view and update Histroy
//URL http://localhost:5000/video/viewandhistroy:id     here id is video_id

router.post("/viewandhistroy/:id", async (req,res)=>{
    try{
        const video_id=req.params.id;
        const {user_id}=req.body;
        const histroy=await Histroy.findOne({user_id});
        const video=await Video.findOne({_id:video_id});
        if(!histroy){
            const histroy=new Histroy();
            histroy.user_id=user_id;
            histroy.watchedVideos.push(video_id);
            await histroy.save();
            return res.status(200).send({message:"Added to histroy"});
        }
        histroy.watchedVideos.push(video_id);
        await histroy.save();
        video.views=video.views+1;
        await video.save();
        return res.sendStatus(200);
    }catch(err){
        console.error({err});
    }
});

//Search functionality
// URL: POST http://localhost:5000/video/search
router.post("/search", async (req, res) => {
    try {
        const query = req.body.query;
        console.log(query);
        const regex = new RegExp(query, 'i'); // i = case-insensitive

        const videos = await Video.find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        }).populate("user_id", "channelName channelImageURL");
        console.log(videos);
        res.status(200).send(videos);
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: "Invalid Request" });
    }
});

module.exports = router;