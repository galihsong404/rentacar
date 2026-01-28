import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cars, categories, testimonials } from '../data/cars';
import CarCard from '../components/features/CarCard';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        location: '',
        startDate: '',
        endDate: '',
        carType: '',
    });

    const featuredCars = cars.filter(car => car.featured).slice(0, 6);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchData.location) params.set('location', searchData.location);
        if (searchData.carType) params.set('type', searchData.carType);
        navigate(`/cars?${params.toString()}`);
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                </div>

                <div className="container hero-container">
                    <div className="hero-content animate-fadeInUp">
                        <span className="hero-badge">🚗 #1 Car Rental Marketplace</span>
                        <h1 className="hero-title">
                            Temukan Mobil <span className="gradient-text">Impianmu</span> untuk Setiap Perjalanan
                        </h1>
                        <p className="hero-subtitle">
                            Rental mobil dengan pilihan terlengkap, harga terbaik, dan pelayanan profesional.
                            Mulai perjalanan Anda bersama RentaCar.
                        </p>

                        {/* Search Box */}
                        <form className="search-box" onSubmit={handleSearch}>
                            <div className="search-field">
                                <label>📍 Lokasi</label>
                                <select
                                    value={searchData.location}
                                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                                >
                                    <option value="">Pilih kota</option>
                                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                                    <option value="Jakarta Barat">Jakarta Barat</option>
                                    <option value="Jakarta Timur">Jakarta Timur</option>
                                    <option value="Bandung">Bandung</option>
                                    <option value="Surabaya">Surabaya</option>
                                </select>
                            </div>

                            <div className="search-field">
                                <label>📅 Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={searchData.startDate}
                                    onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                                />
                            </div>

                            <div className="search-field">
                                <label>📅 Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={searchData.endDate}
                                    onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                                />
                            </div>

                            <div className="search-field">
                                <label>🚙 Tipe Mobil</label>
                                <select
                                    value={searchData.carType}
                                    onChange={(e) => setSearchData({ ...searchData, carType: e.target.value })}
                                >
                                    <option value="">Semua tipe</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="mpv">MPV</option>
                                    <option value="sport">Sport</option>
                                    <option value="electric">Electric</option>
                                </select>
                            </div>

                            <button type="submit" className="search-btn">
                                🔍 Cari Mobil
                            </button>
                        </form>

                        {/* Stats */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-value">500+</span>
                                <span className="stat-label">Armada Mobil</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-value">50K+</span>
                                <span className="stat-label">Pelanggan Puas</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-value">20+</span>
                                <span className="stat-label">Kota Tersedia</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image animate-fadeIn">
                        <img
                            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
                            alt="Luxury car"
                        />
                        <div className="hero-image-glow"></div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Kategori Mobil</h2>
                        <p className="section-subtitle">Pilih kategori sesuai kebutuhan perjalanan Anda</p>
                    </div>

                    <div className="categories-grid">
                        {categories.slice(1).map((category, index) => (
                            <Link
                                to={`/cars?type=${category.id}`}
                                key={category.id}
                                className="category-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <h3 className="category-name">{category.name}</h3>
                                <p className="category-count">{category.count} mobil</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Cars Section */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Mobil Populer</h2>
                            <p className="section-subtitle">Pilihan terbaik yang paling diminati pelanggan kami</p>
                        </div>
                        <Link to="/cars" className="btn btn-outline">
                            Lihat Semua →
                        </Link>
                    </div>

                    <div className="cars-grid">
                        {featuredCars.map((car, index) => (
                            <div key={car.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fadeInUp">
                                <CarCard car={car} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section why-section">
                <div className="why-background"></div>
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Mengapa Memilih RentaCar?</h2>
                        <p className="section-subtitle">Kami memberikan pengalaman rental mobil terbaik untuk Anda</p>
                    </div>

                    <div className="why-grid">
                        <div className="why-card">
                            <div className="why-icon">🛡️</div>
                            <h3>Terjamin & Aman</h3>
                            <p>Semua kendaraan diasuransikan dan dilengkapi dengan dokumen lengkap untuk keamanan Anda.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">💰</div>
                            <h3>Harga Transparan</h3>
                            <p>Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">🚗</div>
                            <h3>Armada Terawat</h3>
                            <p>Mobil selalu dalam kondisi prima dengan perawatan rutin dan kebersihan terjaga.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">📞</div>
                            <h3>Support 24/7</h3>
                            <p>Tim customer service kami siap membantu Anda kapan saja, di mana saja.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">⚡</div>
                            <h3>Proses Cepat</h3>
                            <p>Booking online dalam hitungan menit. Tanpa ribet, tanpa antri.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">🎁</div>
                            <h3>Program Loyalitas</h3>
                            <p>Dapatkan poin setiap rental dan tukarkan dengan diskon menarik.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Apa Kata Mereka?</h2>
                        <p className="section-subtitle">Testimoni dari pelanggan setia RentaCar</p>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className="testimonial-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="testimonial-rating">
                                    {'⭐'.repeat(testimonial.rating)}
                                </div>
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <div className="testimonial-author">
                                    <img src={testimonial.avatar} alt={testimonial.name} />
                                    <div>
                                        <h4>{testimonial.name}</h4>
                                        <p>{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2>Siap untuk Perjalanan Anda?</h2>
                            <p>Daftar sekarang dan dapatkan diskon 10% untuk rental pertama Anda!</p>
                            <div className="cta-buttons">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Daftar Gratis
                                </Link>
                                <Link to="/cars" className="btn btn-secondary btn-lg">
                                    Lihat Katalog
                                </Link>
                            </div>
                        </div>
                        <div className="cta-image">
                            <img
                                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"
                                alt="Sports car"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
