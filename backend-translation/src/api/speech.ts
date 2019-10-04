import  AWS from "aws-sdk";

export const speechAPI = new AWS.Polly({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  signatureVersion: "v4"
});
