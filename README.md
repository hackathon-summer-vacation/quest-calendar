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

## Node.jsを用いたバックエンドの書き方
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
```

## バックエンドの起動のやり方

backendフォルダの中に入り、この際にたくさんnpm installをたくさんした後、最後に`npm run start`をターミナルに叩く。

`cd backend`

`npm install sqlite`

`npm install sqlite3`

`npm install multer`

`npm install express`

`npm install express-session`

`npm install bcrypt`

`npm install jsonwebtoken`

`npx expo install @react-native-async-storage/async-storage`

...

`npm run start`

もしまだうまくいかなかったら、no module foundのところのモジュールを `npm install モジュール名`でコマンドを打って、インストールしてください、最後に`npm run start`でサーバーを立ち上げます

## APIの書き方
### フォルダごとのAPI

APIというのは、フロントエンド側のfetch命令を受け取って、その命令に応じてjsonファイルまたはテキストを返す関数みたいなもの。今回はbackendフォルダの中のroutesフォルダの中に、機能ごとにファイルを分けてAPIを書いています.

server.jsに2つのファイルルートが現在入ってます

```
// routes/auth.jsの中のapiが使えるようにする
app.use("/auth", authRoutes);
// routes/user.jsの中のapiが使えるようにする
app.use("/user", userRoutes);
```

`backend/auth`はログイン、登録、ログアウトなどの認証系のAPIが入ってます。これをserver.jsで`app.use("/auth", authRoutes);`を書くことで、server.jsがこのルートを認識できるようになります。


`backend/user`はユーザー情報取得などのAPIが入ってます。

新しいAPIを書くときは、機能ごとに新たにjsファイルを作ってその中にAPI入れてみてください。

### 具体的なAPIの書き方
まず、下のようにテンプレートを用意します。
ルート名は機能ごとに決めてください。例えば、ユーザーの情報を取ってくるAPIなら/getuserなどの名前をつける。

reqというのは、フロントエンド側から受け取る情報で、例えば、req.bodyという形でjsonファイルを渡してきたら、req.body = {"username": miki}などのjsonファイルが入ってます。

resはフロントエンドに返す部分で、データベースから取ってきた結果を、res.json(jsonファイル)の形で返します。

```
router.get("/ルート名", (req, res) => {
  try {
    // フロントエンド側から取ってきた情報の処理

    // ここで何かしらデータベースと通信をとってきて必要な情報を受け取る

    // フロントエンド側に返す

  } catch (err) {
    res.status(500).send("サーバーで問題が起きました。もう一度試してください。");
  }
})
```

例えば、usernameをフロントエンド側からもらって、データベースのuserテーブルからusernameが一致するものを返すものはこう書きます

```
router.post("/getUserInfo", async (req, res) => {
  const { username } = req.body;

  // usernameが受け取らなかった時のエラー
  if (!username) {
    return res.status(USER_PARAMETER_ERROR).type('text')
      .send("Username or password is empty")
  }

  try {
    // データベースとの接続
    const db = await getDBConnection();

    // usernameが一致するものをuserテーブルから取ってくる
    const user = await db.get("SELECT * FROM user WHERE username = ?", username);

    if (!user) {
      return res.status(USER_PARAMETER_ERROR).send("ユーザーが存在しません");
    }

    // jsonファイルでフロントエンド側に返す
    res.json(user);

  } catch (err) {
    res.status(SERVER_ERROR).type("text")
      .send("サーバーに問題が起きました。もう一度試してください。");
  }

});
```

### フロントエンド側はどう呼び出すの??
バックエンド側のAPIができたので、フロントエンド側から呼び出すと、その結果を返します。

その前にbackendフォルダに入って、`npm run start`とするのを忘れないでください。

フロントエンド側
```
async function login(username, password) {
    try {
      //このfetch関数で呼び出す
      const res = await fetch("http://localhost:8000/user/getUserInfo", {
        method: "GET", // get タイプのリクエスト
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username }) // このbodyパートをAPIに渡す
      });

      data = await res.json() // json型にする
      console.log(data) // 返ってきたdataを処理する
    } catch (err) {
      console.log(err)
      console.log("error when logging in")
    }
  }
```

