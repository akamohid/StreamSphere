const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const LikeSchema= new Schema({
    "video_id":{
        type:mongoose.Types.ObjectId,
        required:true
    },
    "user_id":{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User",
    },
    "date":{
        type:Date,
        default:Date.now
    },
});
module.exports= mongoose.model('Likes', LikeSchema);