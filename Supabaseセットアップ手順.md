# Supabase SQL の実行方法

## 手順

### 1. Supabase を開く
1. https://supabase.com にアクセス
2. ログインして、プロジェクトを開く（または新規作成）

### 2. SQL Editor を開く
1. 左側のメニューで **SQL Editor** をクリック
   （コードアイコン `</>` のマーク）
2. **New query** ボタンをクリック

### 3. SQL を貼り付けて実行（1回目）
1. 下の **【SQL 1】初期スキーマ** の内容をすべて選択してコピー
2. SQL Editor の白いエリアに貼り付け
3. 右下の **Run** ボタン（▶ アイコン）をクリック
4. 「Success」と出ればOK

### 4. SQL を貼り付けて実行（2回目）
1. もう一度 **New query** をクリック
2. 下の **【SQL 2】サンプルデータ** の内容をすべてコピー
3. 貼り付けて **Run** をクリック

---

## 【SQL 1】初期スキーマ

```
-- Resources: 予約対象（会議室、サロン席など）
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 1,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Settings: 営業時間・枠設定
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- デフォルト設定
INSERT INTO settings (key, value) VALUES
  ('business_hours', '{"open": "09:00", "close": "18:00"}'),
  ('slot_duration_minutes', '30'),
  ('advance_booking_days', '30')
ON CONFLICT (key) DO NOTHING;

-- Reservations: 予約
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reservations_resource_date ON reservations(resource_id, date);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- RLS (Row Level Security)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Allow public insert on resources" ON resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on resources" ON resources FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on resources" ON resources FOR DELETE USING (true);

CREATE POLICY "Allow public read on reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on reservations" ON reservations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on reservations" ON reservations FOR DELETE USING (true);

CREATE POLICY "Allow public read on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on settings" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on settings" ON settings FOR UPDATE USING (true);
```

---

## 【SQL 2】サンプルデータ

```
-- サンプルリソース
INSERT INTO resources (name, description, capacity, category) VALUES
  ('会議室A', '最大8名収容', 8, 'meeting'),
  ('会議室B', '最大4名収容', 4, 'meeting'),
  ('個室1', 'プライベートルーム', 2, 'room');
```

---

## うまくいかない場合
- 「relation already exists」→ すでに作成済み。そのまま次へ
- 「permission denied」→ プロジェクトのオーナーでログインしているか確認
