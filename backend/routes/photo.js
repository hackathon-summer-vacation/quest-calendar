"use strict";
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');


const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const multer = require("multer");

const bcrypt = require("bcrypt"); //パスワードのハッシュ化

const router = express.Router();

const getDBConnection = require("../db");

require('dotenv').config()
const USER_PARAMETER_ERROR = 400
const SERVER_ERROR = 500


const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error('AWSの環境変数が設定されていません');
}

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

router.get('/get-signed-url', async (req, res) => {
  try {

    console.log("hi")

    const key = req.query.key;

    if (!key) {
      return res.status(400).json({ error: 'key is required' });
    }

    console.log("hi ???")

    const command = new PutObjectCommand({
      Bucket: 'homeworksubmit',
      Key: key,
      ContentType: 'image/jpeg',
    });
    

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    console.log("hi ??????")
    res.json({ url, key });

  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;