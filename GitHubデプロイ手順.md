# GitHub・Vercel デプロイの進め方

## ステップ0: Git をインストール（最初に1回だけ）

1. https://git-scm.com/download/win を開く
2. 「Click here to download」をクリック
3. ダウンロードしたファイルを実行
4. 指示に従って「Next」をクリック（デフォルトのままでOK）
5. インストール完了後、**Cursor をいったん閉じて、もう一度開く**

---

## ステップ1: ターミナルを開く

1. Cursor で「予約システム」フォルダを開いた状態にする
2. キーボードで **Ctrl + `** を押す（` は Esc の下のキー）
3. 画面下に黒い画面が出る → これがターミナル

---

## ステップ2: コマンドを1つずつ実行する

ターミナルに、**1行ずつ**コピーして貼り付け、**Enter** を押す。

### 2-1. 最初のコマンド
```
git init
```
貼り付けて Enter

### 2-2. 2番目のコマンド
```
git add .
```
貼り付けて Enter

### 2-3. 3番目のコマンド
```
git commit -m "Initial commit"
```
貼り付けて Enter

### 2-4. 4番目のコマンド
```
git branch -M main
```
貼り付けて Enter

### 2-5. 5番目のコマンド
```
git remote add origin https://github.com/shun922/airlink.git
```
貼り付けて Enter

### 2-6. 6番目のコマンド（最後）
```
git push -u origin main
```
貼り付けて Enter

→ GitHub のログインを求められたら、ユーザー名とパスワードを入力

---

## ステップ3: Vercel でデプロイする

1. https://vercel.com を開く
2. 「Sign Up」→「Continue with GitHub」でログイン
3. 「Add New...」→「Project」をクリック
4. 一覧から「airlink」を選んで「Import」をクリック
5. **Environment Variables** で以下を追加：
   - Name: `NEXT_PUBLIC_SUPABASE_URL`  
     Value: `https://kkkrrxtggvjqiohzedvx.supabase.co`
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     Value: （Supabaseのanonキーを貼り付け）
6. 「Deploy」をクリック
7. 完了したら表示される URL が本番の予約システム

---

## 困ったとき

- 「git は認識されていません」→ Git をインストールして、Cursor を再起動
- 「Permission denied」→ GitHub にログインできているか確認
- コマンドは **1行ずつ** 実行する（まとめて貼り付けない）
