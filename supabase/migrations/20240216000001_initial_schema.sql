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

-- RLS (Row Level Security): 匿名読み取り・書き込みを許可（本番では要制限）
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
