'use strict';

const express = require('express');
const app = express();

const Database = require('better-sqlite3');

const getDBConnection = require("./db");

const multer = require('multer');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const homeworkRoutes = require('./routes/homework');

const path = require('path');
const fs = require('fs');

const db = new Database('example.db');

const USER_PARAMETER_ERROR = 400;
const SERVER_ERROR = 500;

// CORS設定を追加
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // プリフライトリクエストへの対応
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

// routes/auth.jsの中のapiが使えるようにする
app.use('/auth', authRoutes);
// routes/user.jsの中のapiが使えるようにする
app.use('/user', userRoutes);
// routes/homework.jsの中のapiが使えるようにする
app.use('/homework', homeworkRoutes);

// 例
app.get('/all', async (req, res) => {
  try {
    // 全ユーザーを取得（複数なので all() にする）
    const users = db.prepare('SELECT * FROM user').all();

    // クライアントに JSON として返す
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// 宿題挿入
app.post('/homework/add/', async (req, res) => {
  const { user_id, title, deadline, days, description, type, extra } = req.body;
  const db = await getDBConnection();

  if (
    user_id == null || title === '' || deadline === '' ||
    isNaN(days) || description === '' || type == null
  ) {
    return res.status(400).json({ error: '必要な項目が不足しています。' });
  }

  try {
    // 1. homework テーブルに基本情報を追加
    const insertHomework = `
      INSERT INTO homework (user_id, title, deadline, days, description, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;


    const result =  await db.run(insertHomework, [user_id, title, deadline, days, description, type])

    const homeworkId = result.lastID;
    // // 2. extra テーブルに挿入（タイプ別）
    let query = '';
    let params = [];

    if (type === 0) {
      console.log("type0")
      query = `INSERT INTO habit (homework_id, frequency, user_id) VALUES (?, ?, ?)`;
      params = [homeworkId, extra.frequency || 1, user_id];
    } else if (type === 1) {
      query = `INSERT INTO pages (homework_id, total_pages, user_id) VALUES (?, ?, ?)`;
      params = [homeworkId, extra.total_pages || 0, user_id];
    } else if (type === 2) {
      query = `INSERT INTO research (homework_id, theme, user_id) VALUES (?, ?, ?)`;
      params = [homeworkId, extra.theme || '', user_id];
    } else {
      return res.status(400).json({ error: '不正なタイプです。' });
    }

    db.run(query, params);
    await db.close()
    res.json({message: "登録成功しました"})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'サーバーにエラーが発生しました。もう一度試してください。' });
  }
});






app.use(express.static('public'));
const PORT_NUMBER = 8000;
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT);
