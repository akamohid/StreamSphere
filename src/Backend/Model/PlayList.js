const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const PlayListSchema= new Schema({
    "user_id":{
        type:mongoose.Types.ObjectId,
        required:true
    },
    "video_id":[{
        type:mongoose.Types.ObjectId,
    }],
    "playlist_id":{
        type:mongoose.Types.ObjectId,
    },
    "name":{
        type:String,
        required:true
    }
});
module.exports= mongoose.model('PlayList', PlayListSchema);