import AWS from "aws-sdk";
import * as fs from "fs";
import { logWrite } from "./logService.js";

const s3 = new AWS.S3({
  endpoint: process.env.SPACES_S3_AWS_ENDPOINT,
  accessKeyId: process.env.SPACES_S3_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_S3_AWS_SECRET_KEY,
});

const { SPACES_S3_BUCKET_NAME} = process.env;

export const fileUpload = (filePath, fileName) => {
  const tempFile = fs.readFileSync(filePath);
  s3.upload({
    Bucket: SPACES_S3_BUCKET_NAME,
    Key: fileName,
    Body: tempFile,
  })
    .promise()
    .then(data => {
      logWrite("uploaded file into SPACES (s3)");
      logWrite(JSON.stringify(data));
    })
    .catch(console.error);
};
