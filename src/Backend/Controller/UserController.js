const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Model/User");
const { GenerateAccessToken, GenerateRefreshToken } = require("../Auth/GenerateToken");
const { PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const S3 = require("../AWS/AWSConfig");
const bucketName = process.env.BUCKET_NAME;
const sharp = require('sharp');
const router = express.Router();
const crypto = require('crypto');
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const { getSignedUrl } =require ("@aws-sdk/s3-request-presigner");
const requireAuth = require('../Middleware/authMiddleware');


//Get All User 
//URL: https://localhost:5000/user/
router.get("/", (req, res) => {
    res.send({ message: "Connected...." });
});

// User Signup
//URL http://localhost:5000/user/signup
router.post("/signup", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User(req.body);
        user.password = hashedPassword;
        await user.save();
        res.status(201).send({ message: "User created successfully" });
    } catch (err) {
        console.error("Error saving user:", err);
        if (err.name === "ValidationError") {
            return res.status(400).send({ error: err.message });
        }
        res.status(500).send({ error: "Failed to create user" });
    }
});


//User Login
//URL  http://localhost:5000/user/login

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).send({ error: "Invalid Username and Password" });
        }

        const login = await bcrypt.compare(password, user.password);
        if (login) {

            const accessToken = GenerateAccessToken(email);
            const refreshToken = GenerateRefreshToken(email);
            user.refreshToken = refreshToken;
            await user.save();
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true });
            console.log(accessToken);
            return res.status(201).send({ message: "Logged in successfully", accessToken, refreshToken });
        } else {
            res.status(400).send({ error: "Invalid Username and Password" });
        }
    } catch (err) {
        res.status(500).send({ error: "Login Failed", err: err });

    }
})


//Return data of specifc user
//URL http://localhost:5000/user/getuser
router.get("/getuser/:id", async (req,res)=>{
    try {
        const user_id=req.params.id;
        const user=await User.findOne({_id:user_id});
        if(!user){
            console.log("error");
        }
        return res.status(200).send(user);
    } catch (error) {
        console.error({error});
    }
});


//Forgot Password
//URL http://localhost:5000/user/forgotpassword
router.put("/forgotpassword", async (req, res) => {
    try {
        const { email, NewPassword, ConfirmPassword } = req.body;
        if (!email || !NewPassword || !ConfirmPassword) {
            console.log("Error while updating password....");
            res.status(500).send({ error: "Failed to update user" });
        }
        else if (NewPassword != ConfirmPassword) {
            console.log("New password does not match")
            res.status(500).send({ error: "New Password Does not match" });
        }
        else {
            const user = await User.findOneAndUpdate({
                email: email,
                password: NewPassword,
            });
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }

            res.status(200).send({ message: "Password updated successfully" });
        }

    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).send({ error: "Failed to Update Password....." });
    }
});



//Upload Image
//URL http://localhost:5000/user/uploadimage/id           this id is user_id

const generatePublicURL = (key) =>
  `https://${bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

router.put("/uploadimage/:id", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded or wrong field name" });
    }
    console.log(req.file);

    const user_id = req.params.id;
    const user = await User.findById(user_id);
    if(user.channelImageURL){
        user.channelImageURL='';
    }

    const imageName = crypto.randomBytes(32).toString('hex');

    const buffer = await sharp(req.file.buffer)
      .resize({ height: 800, width: 800, fit: 'contain' })
      .toBuffer();

    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await S3.send(command);

    const publicImageUrl = generatePublicURL(imageName);
    
    user.channelImageURL = publicImageUrl; 
    await user.save();

    res.status(200).json({ success: true, imageURL: publicImageUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.sendStatus(400);
  }
});


//display Image
//URL http://localhost:5000/user/getimage

router.get("/getimage", async (req, res) => {
    try {
        const users = await User.find();
        const userImages = await Promise.all(
            users.map(async (user) => {
                if (!user.channelImageName) return user;

                const getObjectParams = {
                    Bucket: bucketName,
                    Key: user.channelImageName,
                };

                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(S3, command, { expiresIn: 3600 });

                user.channelImageURL=url;
                await user.save();
                return {
                    ...user.toObject(),
                    channelImageURL: url,
                };
            })
        );

        res.status(200).send(userImages);
        }
    catch (err) {
        console.error("Error", err);
        res.sendStatus(400);
    }
});

router.get('/profile', requireAuth, (req, res) => {
  // Only the token-holder can hit this
  const { _id, email, channelName, channelImageURL } = req.user;
  res.json({ _id, email, channelName, channelImageURL });
});

module.exports = router;