import * as AWS from "aws-sdk";

export const translateAPI = new AWS.Translate({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: "2017-07-01"
});
