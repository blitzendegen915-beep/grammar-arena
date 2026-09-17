# Grammar Arena

不定詞（Lesson 13〜15・Plus）の演習用Webアプリです。

## できること

- 並べ替え・選択・入力の3形式で演習
- 正答直後の判定、正答、文法解説、出典表示
- 基礎・標準・発展の難易度切り替え
- 生徒の切り替え（選択内容はブラウザに保存）
- 講座プルダウン（現在は「基礎講座 - 不定詞」のみ有効。他単元は後日追加表示）
- 正答数に応じたレート変動（ブラウザのローカル保存）
- セッション終了後の学習履歴保存
- 画面幅に応じたデスクトップ／モバイル表示

問題データは参照PDF「英語演習I 2中.pdf」のLesson 13〜15・Plusに掲載された例題・Exerciseをもとに構成しています。

## 起動

```text
pnpm install
pnpm dev
```

本番ビルドは `pnpm build` です。

## Public score backend

`backend/Code.gs` is a Google Apps Script web app for the public rating board.
It stores player names and answers in a private Google Spreadsheet, uses a script lock for concurrent submissions, and rejects the same `name + course + questionId` twice.

Copy `.env.example` to `.env.local` and set `VITE_SCORE_API_URL` to the deployed Apps Script `/exec` URL before building the public site.

The public site displays names on the leaderboard. This classroom MVP uses the entered name as the player key; it does not provide account authentication, so a student can impersonate another name. A future authenticated release can replace `keyFor_` with a login identity without changing the question UI.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys `dist/` on every push to `main`. In the repository settings, set Pages > Build and deployment > Source to **GitHub Actions**.
