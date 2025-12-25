const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const SubscribeSchema= new Schema({
    "user_id":{
        type:mongoose.Types.ObjectId,
        required:true
    },
    "subscribedChannel":{
        type: [mongoose.Schema.Types.ObjectId],
        required: true, 
    },
});
module.exports= mongoose.model('Subscribed', SubscribeSchema);