# quest-calendar

クエスト形式のタスク管理アプリです。

この版はバックエンドを使わず、初期データを JSON として同梱し、ユーザーが追加したデータはブラウザ/端末内の `AsyncStorage` に保存します。GitHub Pages に静的サイトとしてデプロイできます。

## ローカル起動

```bash
npm install
npm run start
```

## 静的ビルド

```bash
npm run build:github-pages
```

ビルド結果は `questCalendar/dist` に作成されます。

## GitHub Pages デプロイ

このリポジトリには `.github/workflows/deploy-github-pages.yml` が入っています。

GitHub のリポジトリ画面で次の設定にしてください。

1. `Settings` を開く
2. `Pages` を開く
3. `Build and deployment` の `Source` を `GitHub Actions` にする
4. ブランチに push する
5. `Actions` タブで `Deploy GitHub Pages` が成功するのを確認する

`Source` が `Deploy from a branch` のままだと、リポジトリ直下の README が表示されることがあります。

## リポジトリ名を変えた場合

GitHub Pages の URL が `https://ユーザー名.github.io/quest-calendar/` 以外になる場合は、`questCalendar/app.json` の次の値を実際のリポジトリ名に合わせて変更してください。

```json
"baseUrl": "/quest-calendar"
```
