import  AWS from "aws-sdk";

export const comprehendAPI = new AWS.Comprehend({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: "2017-11-27",
  signatureVersion: "v4"
});
