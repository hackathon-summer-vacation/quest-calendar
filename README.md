# quest-calendar
クエスト形式のタスク管理アプリ

## React Nativeの環境構築 (下の過程はすでに行いました)
プロジェクトファイルの作成

`npx create-expo-app questCalendar`

## ローカルで開発環境の立ち上げ
1. questCalendarフォルダの中にはいる

`cd questCalendar`

2. 開発環境の立ち上げ

`npx expo start`

3. Xcodeでアイフォンのシミュレータの立ち上げ
  - Xcodeのアプリを開く

  - 上のメニューのXcodeを押して Open Developer Toolを開きSimulatorを開いてiphoneを開く

  - VScodeのターミナルに戻って、iをターミナルに叩く

  - するとシミュレーションのiphoneがreact nativeのアプリを開く

## Node.jsを用いたバックエンド
1. backendフォルダにexmaple.sql, example.dbを用意する

2. example.sqlにはCREATE TABLEやINSERT TABLEなどの命令を書き、sqlを実行してデータベースを初期化する

`sqlite3 example.db < example.sql`

3. server.jsにexpressやsqliteなど、データベースとの通信に必要なものをダウンロードする

```
"use strict";

const express = require("express");
const app = express();

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const multer = require("multer");

const USER_PARAMETER_ERROR = 400;
const SERVER_ERROR = 500;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());
```

4. データベースとの接続

```
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'example.db', // THIS IS NOT THE TABLE NAME
    driver: sqlite3.Database
  });
  return db;
}
```

5. ポート番号を8000にして、サーバーをたてる

```
app.use(express.static('public'));
const PORT_NUMBER = 8000;
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT);
```

6. データベースにアクセスしてデータをいじるSQLをかいて、もし成功したらフロントエンド側に返す、下のコードの場合は、/allというルートを使うと、userテーブルの全ての行を取得する

```
app.get("/all", async (req, res) => {
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
    res.status(SERVER_ERROR).type("text")
      .send("Something is wrong with server. Please try again");
  }
});
```

7. localhostを使ってこのサーバーに接続する、この際にたくさんnpm installするものがある

`npm run start`

`npm install sqlite`

`npm install sqlite3`

`npm install multer`

`npm install express`

8. ブラウザを開いて ``を打って、jsonファイルが出力されたら成功

`localhost:8000/all`

`{"user":[{"user_id":1,"username":"miki","password":"mimi"}]}`
が表示される


