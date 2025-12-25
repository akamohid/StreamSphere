const express = require("express");
const connect = require("./DataBase/DataBaseConnection");
const userRouter=require("./Controller/UserController");
const videoRouter=require("./Controller/VideoController");
const playlistRouter=require("./Controller/PlaylistController");
const SubscribedRouter=require("./Controller/SubscribeController");
const LikedRouter=require("./Controller/LikeController");
const CommentRouter=require("./Controller/CommentController");
const HistroyRouter=require("./Controller/HistroyController");
const RatingRouter=require("./Controller/RatingController");
const RefreshToken=require("./Routes/RefreshTokenRoute");
const cookieParser = require("cookie-parser");
const verifyJWT=require("./Middleware/verifyJWT");

const cors = require('cors');

const app = express();


app.use(cors({
    origin: ['http://localhost:5173','http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
  }));

  app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin");
    next();
  })

app.use(express.json({limit:'500mb'}));
app.use(cookieParser());

//Refresh Token
app.use("/refresh", RefreshToken);

//User Routes
app.use("/user",userRouter);

//Authorization
app.use(verifyJWT);

//Video Router
app.use('/video', videoRouter);

//Playlist Router
app.use('/playlist', playlistRouter);

//Subscribe Router
app.use('/subscription',SubscribedRouter);

//Like Router
app.use('/like',LikedRouter);

//Comment Router
app.use('/comment',CommentRouter);

//Histroy Router
app.use('/histroy',HistroyRouter);

//Rating Router
app.use('/rating',RatingRouter);

app.listen(5000, () => {
    console.log("Server connected..");
    connect();
})