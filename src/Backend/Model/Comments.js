const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    "video_id": {
        type: mongoose.Types.ObjectId,
        required: true
    },
    "comment": {
        type: String,
    },
    "user_id": {
        type: mongoose.Types.ObjectId,
        required: true,
        ref:"User",
    },
    "date": {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('Commment', CommentsSchema);