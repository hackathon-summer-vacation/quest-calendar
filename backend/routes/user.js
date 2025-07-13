"use strict";

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");


const multer = require("multer");

const bcrypt = require("bcrypt"); //パスワードのハッシュ化

const router = express.Router();

const getDBConnection = require("../db");

const USER_PARAMETER_ERROR = 400
const SERVER_ERROR = 500

// 第三者の改竄を防ぐためのサーバー側の秘密鍵
const SECRET_KEY = "quest_calendar_secret_key#123";

// 自分の情報を取ってくるAPI tokenを取得後、それを認証できたら
// decodedの中のuserIdを使ってデータベースと通信する例
router.get("/me", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Token required");

  try {
    // tokenの認証をする
    const decoded = jwt.verify(token, SECRET_KEY);
    // ここでuserIdの取得ができる
    console.log(decoded) // { userId: 7, username: 'Mimi', iat: 1751791506, exp: 1751795106 }

    // ここで何かしらデータベースと通信をとってきて必要な情報を受け取る

    res.json({ id: decoded.id, username: decoded.username });
  } catch (err) {
    res.status(403).send("Invalid token");
  }
});

module.exports = router;