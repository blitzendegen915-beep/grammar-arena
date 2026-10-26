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

The public site displays names on the leaderboard. Registration/login uses a PIN and a server-issued token. Names remain the player keys. This is a classroom MVP, not high-assurance authentication or tamper-resistant scoring.

## Answer responsiveness and saving

Answers are graded in the browser immediately. Rating updates are saved separately using a durable browser-local queue, so a slow server does not block the next question. Until the server confirms a queued answer, its rating is provisional. Do not clear browser storage while answers are waiting to save.

The queue sends answers in order, times out stalled requests, and uses bounded automatic retries. A duplicate answer response reconciles the rating without applying the score again. The Apps Script `compact=true` answer response omits a full leaderboard calculation; leaderboard reads remain separate. Deploy both the frontend and the updated `backend/Code.gs` for authoritative duplicate reconciliation.

Run queue regression checks with `node --test src/answerSync.test.js`.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys `dist/` on every push to `main`. In the repository settings, set Pages > Build and deployment > Source to **GitHub Actions**.

## 教員ページの全体ランキング

教員ページは通常メニューには表示しません。「おとめ座」の既存の隠し操作と管理者認証から開きます。「全体ランキング」で総合・講座別を切り替え、学年・クラス・部活・ユーザー名・レート・全体順位を確認できます。「アカウント対応」には従来の生徒検索・レート修正があります。

- 名前・所属の検索、学年（1〜3年）、クラス（A〜M組・未登録）で絞り込めます。検索結果でも講座全体の順位を維持します。同点は同順位（1位、2位、2位、4位）です。
- 平常授業は所属クラス、基礎講座は基礎講座プールのレートを優先します。優先する記録がなければ、別の現在の所属プール、旧講座記録の順に参照します。複数プールのレートを加算しません。講座ごとの記録がない人は「未参加」と表示します。
- 一度に50人を表示し、ページ送りできます。「再読み込み」で最新の記録を取得します。全体一覧はブラウザーの永続ストレージに保存しません。
- POST `admin-ranking` は「おとめ座」の有効なログイントークンと、それに結び付いた管理者セッションの両方が必要です。管理者セッションは15分で失効し、期限切れ時には再認証を案内します。生徒用のプール閲覧制限は従来どおりです。

公開時はフロントエンドとApps Scriptの両方を更新してください。権限・検索・順位・ページングの回帰チェックは `node --test src/adminBackend.test.js src/poolAccess.test.js` で実行できます。

検索結果と全体ランキングの各行にある「削除」から、アカウント削除の確認画面を開けます。サーバーで取得し直した名前・所属を確認し、削除理由、ユーザー名の再入力、対象範囲の確認チェックをそろえて確定します。「おとめ座」自身は削除できません。

削除は管理用の履歴を保持する論理削除です。`Players` の末尾に `deletedAt` / `deletedBy` / `deleteReason` / `deleteOperationId` を記録し、ログイントークンを失効させます。ログイン・同名再登録・検索・全講座と全プールのランキングから除外し、回答とレートの履歴は非公開シート内に保持します。管理者認証とは別に、対象と管理者セッションに結び付いた5分間の確認トークンが必要です。同じ削除要求の再送は重複操作になりません。`AdminAudit` には操作要求を記録し、`Players` の削除日時・操作IDを完了記録とします。

## 総合レートと部活ランキング（2026-10-26）

総合レート = 1,240 + Σ max(0, 講座別レート - 1,240)。基礎講座の旧単元IDは同一講座にまとめ、クラス・基礎講座・部活の重複分は加算しません。初期値未満の講座は総合への寄与を0とし、講座別レートは変更しません。過去の記録も同じ式で集計します。

部活一覧は学校公式 https://www.komazawa.net/about/campusguide/club/ の37部活と無所属です。Playersの16列目clubIdに保存し、既存15列の並びを維持します。未登録の空文字と無所属noneは区別します。部活が未登録の既存利用者は次回ログイン時に選択し、登録後は設定でも変更できます。旧クライアントがclubIdを省略した場合は既存所属を維持します。

部活ランキングは現在の所属で絞り込んだ講座別／総合レートの表示です。部活用のPoolProfilesや別の得点は作成しません。生徒用APIでは本人のクラス、受講中の基礎講座、本人の部活だけを認可し、削除済みユーザーは除外します。部活変更だけでは既存のレート・解答履歴を変更しません。

回帰確認: node --test src/clubRatingsBackend.test.js src/clubRatings.test.js src/clubCatalog.test.js src/poolAccess.test.js src/adminBackend.test.js。
