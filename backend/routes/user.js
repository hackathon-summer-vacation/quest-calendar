"use strict";

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

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
router.get("/me", async (req, res) => {

  try {
    userId = req.params


    // ここで何かしらデータベースと通信をとってきて必要な情報を受け取る
    query = "SELECT username, level, enemies_defeated, bosses_defeated, days_until_deadline FROM user WHERE user_id = ?";
    const userInfo = await db.get(query, userId);
    console.log(userInfo);

    res.json({ username: userInfo.username, level: userInfo.level, enemies_defeated: userInfo.enemies_defeated, bosses_defeated: userInfo.bosses_defeated, days_until_deadline : userInfo.days_until_deadline});
  } catch (err) {
    res.status(403).send("Invalid token");
  }
});

module.exports = router;