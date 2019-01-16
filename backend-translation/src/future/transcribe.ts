import * as AWS from "aws-sdk";
const fetch = require("isomorphic-fetch");

const sleep = waitTimeInMs =>
  new Promise(resolve => setTimeout(resolve, waitTimeInMs));

/*
  TODO: When moving this file out of future. Split platform 
  and functionality into api and wrapper folders respectively. 
*/

const transcribeAPI = new AWS.TranscribeService({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: "2017-10-26"
});

export const transcribe = async (jobName, voiceS3Url) => {
  try {
    let job = await transcribeAPI
      .startTranscriptionJob({
        LanguageCode: "en-US",
        // OutputBucketName: `lingoparrot`,
        TranscriptionJobName: jobName,
        MediaFormat: "mp3",
        // MediaSampleRateHertz: sampleRate,
        Media: {
          MediaFileUri: voiceS3Url
        }
      })
      .promise();
    console.log({ job });

    while (job.TranscriptionJob.TranscriptionJobStatus === "IN_PROGRESS") {
      await sleep(1000);
      job = await transcribeAPI
        .getTranscriptionJob({
          TranscriptionJobName: jobName
        })
        .promise();
      console.log(
        `polling: `,
        job.TranscriptionJob.TranscriptionJobName,
        job.TranscriptionJob.TranscriptionJobStatus
      );
    }

    if (job.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
      const dataJSON = await fetch(
        job.TranscriptionJob.Transcript.TranscriptFileUri
      );
      const data = await dataJSON.json();
      const transcription = data.results.transcripts.reduce(
        (acc, i) => `${acc} ${i.transcript}`,
        ""
      );
      return transcription;
    } else if (job.TranscriptionJob.TranscriptionJobStatus === "FAILED") {
      throw new Error(
        `Failed to transcribe: ${job.TranscriptionJob.FailureReason}`
      );
    } else {
      console.log({ job });
      throw new Error(`Unknown job status`);
    }
  } catch (e) {
    throw new Error(`Error: ${e.toString()}`);
  }
};
