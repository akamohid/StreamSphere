const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema= new Schema({
    "channelName":{
        type:String,
        required:true
    },
    "email":{
        type:String,
        required:true
    },
    "password":{
        type:String,
        required:true
    },
    "refreshToken": {
         type: String
     },
    "subscriber": {
         type: Number
     },
    "channelImageURL": {
         type: String
     },
    "channelImageName": {
         type: String
     },
});
module.exports= mongoose.model('User', UserSchema);