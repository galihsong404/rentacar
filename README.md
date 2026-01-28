# RentaCar - Car Rental Marketplace

Marketplace rental mobil modern dengan fitur lengkap.

## 🚀 Demo

**Live Demo:** [https://rentacar.vercel.app](https://rentacar.vercel.app)

## ✨ Fitur

- 🏠 Homepage dengan Hero Section & Search
- 🚗 Katalog Mobil dengan Filter & Sorting
- 📋 Detail Mobil dengan Booking
- 🔐 Sistem Login/Register
- 👤 Dashboard User (Booking History, Favorites)
- ⚙️ Admin Panel (CRUD Mobil, Booking, User, Lokasi, Settings)
- 🌓 Dark/Light Mode
- 📱 Responsive Design

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Vanilla CSS
- **Database:** Supabase (PostgreSQL)
- **Routing:** React Router DOM
- **Deployment:** Vercel

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/galihsong404/rentacar.git
cd rentacar

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

## 🗄️ Database Setup

1. Create project di [Supabase](https://supabase.com)
2. Copy isi file `supabase/schema.sql`
3. Paste di Supabase SQL Editor
4. Jalankan query

## 🔑 Demo Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rentacar.com | admin123 |
| User | user@rentacar.com | user123 |

## 📁 Project Structure

```
rentacar/
├── src/
│   ├── components/    # Reusable components
│   ├── context/       # React context providers
│   ├── data/          # Mock data (fallback)
│   ├── lib/           # Supabase client
│   └── pages/         # Page components
├── supabase/          # Database schema
└── public/            # Static assets
```

## 🚀 Deployment

Project ini di-deploy ke Vercel dengan environment variables yang sudah dikonfigurasi.

## 📄 License

MIT License

---

Made with ❤️ by RentaCar Team
