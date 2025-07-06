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

// ログイン処理
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(USER_PARAMETER_ERROR).type('text')
      .send("Username or password is empty")
  }

  try {
     const db = await getDBConnection();

    // ユーザー名で検索
    const user = await db.get("SELECT * FROM user WHERE username = ?", username);
    console.log(user)

    if (!user) {
      return res.status(USER_PARAMETER_ERROR).send("ユーザーが存在しません");
    }

    // パスワードの比較
    const is_valid_password = await bcrypt.compare(password, user.password);
    if (!is_valid_password) {
      return res.status(USER_PARAMETER_ERROR).send("パスワードが違います");
    }

    // 認証tokenを返す
    const token = jwt.sign({ userId: user.user_id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ "token" : token, "user": username});

  } catch (err) {
    console.log(err)
    res.status(SERVER_ERROR).type("text")
      .send("サーバーに問題が起きました。もう一度試してください。");
  }

});

// 登録処理
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(USER_PARAMETER_ERROR).type('text')
      .send("ユーザーネームまたはパスワードが空です")
  }

  try {
    const db = await getDBConnection();

    // すでにこのusernameがデータベースにあるか確認
    const duplicateUserName = await findDuplicateUserName(db, username);
    if (duplicateUserName) {
      await db.close();
      return res.status(USER_PARAMETER_ERROR).type("text")
        .send(`このユーザーネームはすでに使われています`);
    } else {

      //パスワードをハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // データベースに挿入
      const query = `INSERT INTO user (username, password) VALUES (?, ?)`
      await db.run(query, [username, hashedPassword]);

      // 成功メッセージを返す
      await db.close();
      res.type("text").send("登録成功しました！下からログインしてください");
    }

  } catch (err) {
    console.log(err)
    res.status(SERVER_ERROR).type("text")
      .send("サーバーに問題がありました。もう一度試してください。");
  }
});

// ログアウト処理
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("ログアウト失敗");
    res.clearCookie("connect.sid");
    res.json({ message: "ログアウト成功" });
  });
});

// すでにそのusernamaeが存在しているかを確認する関数
// もしすでにあればtrue, なければfalseを返す
async function findDuplicateUserName(db, username) {
  try {
    let usernameResult = await db.all("SELECT * FROM user WHERE username = ?", username);
    console.log(usernameResult)
    if (usernameResult.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err)
  }
}

module.exports = router;