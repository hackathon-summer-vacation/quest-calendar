"use strict";

const express = require("express");
const app = express();

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const multer = require("multer");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const getDBConnection = require("./db");

const USER_PARAMETER_ERROR = 400;
const SERVER_ERROR = 500;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

// routes/auth.jsの中のapiが使えるようにする
app.use("/auth", authRoutes);
// routes/user.jsの中のapiが使えるようにする
app.use("/user", userRoutes);

app.get("/all", async (req, res) => {
  try {
    const db = await getDBConnection();

    // 全ユーザーを取得（複数なので all() にする）
    const users = await db.all("SELECT * FROM user");

    // クライアントに JSON として返す
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



app.use(express.static('public'));
const PORT_NUMBER = 8000;
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT);