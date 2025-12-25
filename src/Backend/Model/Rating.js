const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Sub-schema for individual user rating
const userRatingSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  count: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { _id: false }); 

const RatingSchema = new Schema({
  video_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Video',
    unique: true
  },
  ratings: [userRatingSchema]
}, { timestamps: true });

module.exports = mongoose.model("Rating", RatingSchema);
