-- =====================================================
-- RentaCar Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO users (email, password, name, phone, role, avatar) VALUES
('admin@rentacar.com', 'admin123', 'Administrator', '081234567890', 'admin', 'https://i.pravatar.cc/100?img=68'),
('user@rentacar.com', 'user123', 'John Doe', '081234567891', 'user', 'https://i.pravatar.cc/100?img=12')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- LOCATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default locations
INSERT INTO locations (name, city, address) VALUES
('Jakarta Selatan', 'Jakarta', 'Jl. Sudirman No. 123'),
('Jakarta Pusat', 'Jakarta', 'Jl. Thamrin No. 45'),
('Jakarta Barat', 'Jakarta', 'Jl. Kebon Jeruk No. 67'),
('Jakarta Timur', 'Jakarta', 'Jl. Jatinegara No. 89'),
('Bandung', 'Bandung', 'Jl. Braga No. 12'),
('Surabaya', 'Surabaya', 'Jl. Tunjungan No. 34'),
('Tangerang', 'Tangerang', 'Jl. BSD No. 56'),
('Bekasi', 'Bekasi', 'Jl. Ahmad Yani No. 78'),
('Depok', 'Depok', 'Jl. Margonda No. 90'),
('Bogor', 'Bogor', 'Jl. Pajajaran No. 21')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CARS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Sedan', 'SUV', 'MPV', 'Sport', 'Electric', 'Hatchback')),
  year INTEGER NOT NULL,
  transmission VARCHAR(20) NOT NULL CHECK (transmission IN ('Automatic', 'Manual')),
  fuel VARCHAR(20) NOT NULL CHECK (fuel IN ('Bensin', 'Diesel', 'Electric', 'Hybrid')),
  seats INTEGER NOT NULL,
  price_per_day INTEGER NOT NULL,
  price_per_week INTEGER,
  price_per_month INTEGER,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  specs JSONB DEFAULT '{}'::JSONB,
  description TEXT,
  location_id UUID REFERENCES locations(id),
  location VARCHAR(100),
  owner VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample cars
INSERT INTO cars (name, brand, type, year, transmission, fuel, seats, price_per_day, price_per_week, price_per_month, rating, reviews_count, available, featured, images, features, specs, description, location, owner) VALUES
('Toyota Avanza', 'Toyota', 'MPV', 2023, 'Automatic', 'Bensin', 7, 350000, 2100000, 7500000, 4.8, 124, true, true, 
  ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'],
  ARRAY['AC', 'Bluetooth', 'USB Port', 'Airbag', 'GPS', 'Rear Camera'],
  '{"engine": "1.5L 4-Cylinder", "power": "106 HP", "torque": "138 Nm", "fuelConsumption": "12 km/L"}'::JSONB,
  'Toyota Avanza adalah MPV keluarga yang nyaman dan irit bahan bakar.',
  'Jakarta Selatan', 'RentaCar Official'),

('Honda CR-V', 'Honda', 'SUV', 2024, 'Automatic', 'Bensin', 5, 750000, 4500000, 15000000, 4.9, 89, true, true,
  ARRAY['https://images.unsplash.com/photo-1568844293986-8c1a5c14b587?w=800', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800'],
  ARRAY['AC', 'Bluetooth', 'Sunroof', 'Leather Seats', 'GPS', '360 Camera', 'Lane Assist'],
  '{"engine": "1.5L Turbo VTEC", "power": "190 HP", "torque": "243 Nm", "fuelConsumption": "14 km/L"}'::JSONB,
  'Honda CR-V adalah SUV premium dengan teknologi canggih.',
  'Jakarta Pusat', 'Premium Auto Rental'),

('BMW 320i', 'BMW', 'Sedan', 2023, 'Automatic', 'Bensin', 5, 1500000, 9000000, 30000000, 4.9, 56, true, true,
  ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'https://images.unsplash.com/photo-1520050206757-5c611a1c5f3b?w=800'],
  ARRAY['AC', 'Bluetooth', 'Sunroof', 'Leather Seats', 'GPS', 'Parking Assist', 'Keyless Entry'],
  '{"engine": "2.0L TwinPower Turbo", "power": "184 HP", "torque": "300 Nm", "fuelConsumption": "16 km/L"}'::JSONB,
  'BMW 320i adalah sedan mewah dengan performa sporty.',
  'Jakarta Selatan', 'Luxury Car Rental'),

('Mitsubishi Pajero Sport', 'Mitsubishi', 'SUV', 2023, 'Automatic', 'Diesel', 7, 900000, 5400000, 18000000, 4.7, 102, true, true,
  ARRAY['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800'],
  ARRAY['AC', 'Bluetooth', '4WD', 'Leather Seats', 'GPS', 'Rear Camera', 'Hill Assist'],
  '{"engine": "2.4L MIVEC Diesel", "power": "181 HP", "torque": "430 Nm", "fuelConsumption": "11 km/L"}'::JSONB,
  'Mitsubishi Pajero Sport adalah SUV tangguh untuk segala medan.',
  'Bandung', 'Adventure Rental'),

('Tesla Model 3', 'Tesla', 'Electric', 2024, 'Automatic', 'Electric', 5, 1800000, 10800000, 36000000, 4.8, 45, true, true,
  ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800'],
  ARRAY['Autopilot', 'Glass Roof', '17" Touchscreen', 'Supercharging', 'Over-the-Air Updates'],
  '{"engine": "Dual Motor AWD", "power": "450 HP", "torque": "639 Nm", "range": "500 km"}'::JSONB,
  'Tesla Model 3 adalah mobil listrik dengan teknologi self-driving.',
  'Jakarta Pusat', 'Electric Vehicle Rental'),

('Toyota Fortuner GR Sport', 'Toyota', 'SUV', 2024, 'Automatic', 'Diesel', 7, 1100000, 6600000, 22000000, 4.9, 87, true, true,
  ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f845c?w=800', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800'],
  ARRAY['AC', '4WD', 'GR Sport Suspension', '360 Camera', 'JBL Sound System', 'Wireless Charging'],
  '{"engine": "2.8L GD Diesel", "power": "204 HP", "torque": "500 Nm", "fuelConsumption": "10 km/L"}'::JSONB,
  'Toyota Fortuner GR Sport adalah SUV premium dengan DNA motorsport.',
  'Jakarta Timur', '4x4 Adventure Rental'),

('Honda Brio RS', 'Honda', 'Hatchback', 2024, 'Automatic', 'Bensin', 5, 250000, 1500000, 5000000, 4.5, 134, true, false,
  ARRAY['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'],
  ARRAY['AC', 'Bluetooth', 'USB Port', 'Remote Key', 'Airbag'],
  '{"engine": "1.2L i-VTEC", "power": "90 HP", "torque": "110 Nm", "fuelConsumption": "18 km/L"}'::JSONB,
  'Honda Brio RS adalah city car sporty yang irit.',
  'Bogor', 'City Car Rental'),

('Porsche 911 Carrera', 'Porsche', 'Sport', 2024, 'Automatic', 'Bensin', 2, 8000000, 48000000, 160000000, 5.0, 12, true, true,
  ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800'],
  ARRAY['PDK Transmission', 'Sport Chrono', 'PASM', 'Carbon Ceramic Brakes', 'Sport Exhaust'],
  '{"engine": "3.0L Twin-Turbo Flat-6", "power": "385 HP", "torque": "450 Nm", "acceleration": "4.2s 0-100 km/h"}'::JSONB,
  'Porsche 911 Carrera adalah ikon sports car legendaris.',
  'Jakarta Selatan', 'Supercar Rental Jakarta')
ON CONFLICT DO NOTHING;

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  with_driver BOOLEAN DEFAULT false,
  driver_fee INTEGER DEFAULT 0,
  subtotal INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  notes TEXT,
  pickup_location TEXT,
  dropoff_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FAVORITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- =====================================================
-- SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name VARCHAR(255) DEFAULT 'RentaCar',
  site_description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_address TEXT,
  driver_fee_per_day INTEGER DEFAULT 150000,
  min_rental_days INTEGER DEFAULT 1,
  max_rental_days INTEGER DEFAULT 30,
  cancellation_policy TEXT,
  terms_and_conditions TEXT,
  social_facebook VARCHAR(255),
  social_instagram VARCHAR(255),
  social_twitter VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (id, site_name, contact_email, contact_phone, contact_address, driver_fee_per_day) VALUES
(1, 'RentaCar', 'info@rentacar.id', '+62 821 1234 5678', 'Jl. Sudirman No. 123, Jakarta Pusat', 150000)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- REVIEWS TABLE (Optional for future)
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for cars and locations
CREATE POLICY "Cars are viewable by everyone" ON cars FOR SELECT USING (true);
CREATE POLICY "Locations are viewable by everyone" ON locations FOR SELECT USING (true);
CREATE POLICY "Settings are viewable by everyone" ON settings FOR SELECT USING (true);

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (true);

-- Bookings policies
CREATE POLICY "Bookings are viewable by everyone" ON bookings FOR SELECT USING (true);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update bookings" ON bookings FOR UPDATE USING (true);

-- Favorites policies
CREATE POLICY "Favorites are viewable by everyone" ON favorites FOR SELECT USING (true);
CREATE POLICY "Users can manage favorites" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete favorites" ON favorites FOR DELETE USING (true);

-- Admin full access (for admin operations)
CREATE POLICY "Admins can manage cars" ON cars FOR ALL USING (true);
CREATE POLICY "Admins can manage locations" ON locations FOR ALL USING (true);
CREATE POLICY "Admins can manage settings" ON settings FOR ALL USING (true);
CREATE POLICY "Admins can manage users" ON users FOR DELETE USING (true);
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL USING (true);

-- =====================================================
-- STORAGE BUCKET FOR IMAGES
-- =====================================================
-- Run this in Supabase Dashboard > Storage > Create Bucket
-- Bucket name: images
-- Public: Yes

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_cars_type ON cars(type);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(available);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
