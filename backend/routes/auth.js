"use strict";

const express = require("express");
const app = express();

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const multer = require("multer");

const router = express.Router();

const getDBConnection = require("../db");

const USER_PARAMETER_ERROR = 400
const SERVER_ERROR = 500

router.post("/login", (req, res) => {
  // ログイン処理
  const { username, password } = req.body;

  if (username === "user" && password === "pass") {
    req.session.user = { username };
    res.json({ message: "ログイン成功" });
  } else {
    res.status(401).json({ message: "ログイン失敗" });
  }
});

router.post("/register", async (req, res) => {
  // 登録処理
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(USER_PARAMETER_ERROR).type('text')
      .send("Username or password is empty")
  }

  try {
    const db = await getDBConnection();
    const duplicateUserName = await findDuplicateUserName(db, username);
    if (duplicateUserName) {
      await db.close();
      return res.status(USER_PARAMETER_ERROR).type("text")
        .send(`This username has been registered`);
    } else {

      const query = `INSERT INTO user (username, password) VALUES (?, ?)`

      await db.run(query, [username, password]);

      await db.close();
      res.type("text").send("successful");
    }

  } catch (err) {
    console.log(err)
    res.status(SERVER_ERROR).type("text")
      .send("Something is wrong with the server");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "ログアウト成功" });
  });
});

/**
 * Return all user's infomation
 */
router.get("/all", async (req, res) => {
  try {

    let db = await getDBConnection();

    // select all users from user table
    let results = await db.all("SELECT * FROM user");
    if (results.length > 0) {
      let returnResults = {
        "user": results
      };
      await db.close();
      res.json(returnResults);

    // no users in database
    } else {
      await db.close();
      res.status(SERVER_ERROR).type('text')
        .send('No users are in database. Please try again');
    }
  } catch (err) {
    console.log(err)
    res.status(SERVER_ERROR).type("text")
      .send("Something is wrong with server. Please try again");
  }
});

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