const {S3Client}=require('@aws-sdk/client-s3');
const dotenv=require('dotenv');

dotenv.config();

const bucketRegion=process.env.BUCKET_REGION;
const accessKey=process.env.AWS_ACCESS_KEY;
const secretKey=process.env.AWS_SECRET_ACCESS_KEY;

const S3=new S3Client({
    credentials:{
        accessKeyId:accessKey,
        secretAccessKey:secretKey
    },
    region: bucketRegion
});
module.exports=S3;