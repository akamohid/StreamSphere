const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const HistroySchema= new Schema({
    "user_id":{
        type:mongoose.Types.ObjectId,
        required:true
    },
    "watchedVideos":{
        type: [mongoose.Schema.Types.ObjectId],
        required: true, 
    },
    "date":{
        type:Date,
        default:Date.now
    },
});
module.exports= mongoose.model('Histroy', HistroySchema);