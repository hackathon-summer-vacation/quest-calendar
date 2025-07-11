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
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/task-generator', async (req, res) => {
  const { theme } = req.body;

  if (!theme || theme.trim() === '') {
    return res.status(400).json({ error: '研究テーマが必要です。' });
  }

  try {
    const prompt = `
以下の研究テーマに対して、4つの具体的な調査・作業タスクを番号付きで日本語で箇条書きしてください。

研究テーマ: ${theme}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'あなたは研究のタスク分解アシスタントです。' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    const tasks = text.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '' && /^[0-9]+[\.．]/.test(line))
      .map(line => {
        const match = line.match(/^([0-9]+)[\.．]\s*(.+)$/);
        return match ? { task_number: Number(match[1]), content: match[2], deadline: null } : null;
      })
      .filter(task => task !== null);

    res.json({ tasks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AIによるタスク生成に失敗しました。' });
  }
});

module.exports = router;
