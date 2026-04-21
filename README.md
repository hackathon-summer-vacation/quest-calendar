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

おすすめは2通りあります。GitHub Pages 用ブランチをそのまま使う場合は、`Deploy from a branch` で `docs/` を公開する方法が一番わかりやすいです。

### 方法A: GitHub Pages 用ブランチから公開する

GitHub のリポジトリ画面で次の設定にしてください。

1. `Settings` を開く
2. `Pages` を開く
3. `Build and deployment` の `Source` を `Deploy from a branch` にする
4. `Branch` を GitHub Pages 用ブランチにする
5. フォルダは `/docs` にする
6. `Save` を押す

その後、ローカルで次を実行して `docs/` を commit / push してください。

```bash
npm run build:pages-branch
git add docs package.json README.md questCalendar/public/.nojekyll
git add .gitignore scripts/copy-pages-build.mjs
git commit -m "Build GitHub Pages static site"
git push
```

`Branch` のフォルダが `/(root)` のままだと、リポジトリ直下の `README.md` が表示されます。

### 方法B: GitHub Actions から公開する

このリポジトリには `.github/workflows/deploy-github-pages.yml` も入っています。

GitHub Actions を使う場合は、GitHub のリポジトリ画面で次の設定にしてください。

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
