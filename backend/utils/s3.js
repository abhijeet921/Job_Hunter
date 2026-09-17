// backend/utils/s3.js
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

let s3Client = null;

const getConfig = () => {
  const bucketName =
    process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION || process.env.AWS_S3_REGION;
  const accessKeyId =
    process.env.AWS_ACCESS_KEY_ID || process.env.AWS_S3_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_S3_SECRET_ACCESS_KEY;

  const missing = Object.entries({
    bucketName,
    region,
    accessKeyId,
    secretAccessKey,
  })
    .filter(([, v]) => !v || !String(v).trim())
    .map(([k]) => k);

  if (missing.length) {
    throw new Error(
      `AWS S3 config missing: ${missing.join(", ")}. Check backend/.env for ` +
        `AWS_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY.`,
    );
  }

  return {
    bucketName: bucketName.trim(),
    region: region.trim(),
    accessKeyId: accessKeyId.trim(),
    secretAccessKey: secretAccessKey.trim(),
  };
};

const getClient = () => {
  const { region, accessKeyId, secretAccessKey } = getConfig();
  if (!s3Client) {
    s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return s3Client;
};

const buildKey = (file, folder) => {
  const parts = (file.originalname || "").split(".");
  const ext = parts.length > 1 ? parts.pop().toLowerCase() : "bin";
  const safeFolder = folder.replace(/^\/+|\/+$/g, "");
  return `${safeFolder}/${crypto.randomUUID()}.${ext}`;
};

export const uploadToS3 = async (file, folder = "uploads") => {
  if (!file || !file.buffer) {
    throw new Error("A file with a buffer is required to upload to S3");
  }

  const { bucketName, region } = getConfig();
  const client = getClient();
  const key = buildKey(file, folder);

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
    }),
  );

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

export const deleteFromS3 = async (key) => {
  if (!key) return;
  const { bucketName } = getConfig();
  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
};

export const getSignedResumeUrl = async (key, expiresInSeconds = 300) => {
  const { bucketName } = getConfig();
  const client = getClient();
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
};
