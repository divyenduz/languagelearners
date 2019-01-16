import * as AWS from "aws-sdk";

export const storageAPI = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID
  // params: {
  //   Bucket: `lingoparrot/${process.env.NODE_ENV}`
  // }
});
