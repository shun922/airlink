# 予約システム

汎用的な予約管理システム。Next.js + Supabase + Vercel + GitHub で構築されています。

## 機能

- **予約画面** (`/book`): 日付・リソース・時間・お客様情報を入力して予約
- **管理画面** (`/admin`): リソース管理、予約一覧、カレンダービュー、設定
- **簡易認証**: 環境変数 `ADMIN_PASSWORD` で管理画面を保護（オプション）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabase の設定

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. **SQL Editor** で `supabase/migrations/` 内の SQL を順に実行
   - `20240216000001_initial_schema.sql`
   - `20240216000002_seed_data.sql`
3. **Project Settings** → **API** から以下を取得:
   - Project URL
   - anon public key

### 3. 環境変数

`.env.local.example` を `.env.local` にコピーし、値を設定:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=任意（設定すると管理画面にログイン必要）
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## GitHub と Vercel デプロイ

### GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### Vercel

1. [Vercel](https://vercel.com) にログインし、**Add New** → **Project**
2. **Import** から GitHub リポジトリを選択
3. **Environment Variables** に以下を追加:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`（オプション）
4. デプロイ

`main` ブランチへの push で自動デプロイされます。

## ディレクトリ構成

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # トップ
│   │   ├── book/             # 予約フロー
│   │   ├── admin/            # 管理画面
│   │   └── api/              # API
│   └── lib/
│       ├── supabase.ts
│       └── utils.ts
├── supabase/migrations/      # DB スキーマ
└── ...
```

## ライセンス

MIT
