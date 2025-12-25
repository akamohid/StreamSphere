const mongoose = require("mongoose");
const Video = require("../Model/Video"); 
const connect = () => {
  mongoose.connect("mongodb://localhost:27017/StreamSphere", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(async () => {
    console.log("Connected to database");

    await Video.syncIndexes();
    console.log("Video text indexes ensured");

  }).catch((err) => {
    console.error("Database connection error:", err);
  });
};

module.exports = connect;
