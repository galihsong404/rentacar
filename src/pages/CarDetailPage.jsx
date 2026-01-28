import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cars } from '../data/cars';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import CarCard from '../components/features/CarCard';
import './CarDetailPage.css';

export default function CarDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addBooking, toggleFavorite, isFavorite } = useBooking();

    const car = cars.find(c => c.id === parseInt(id));
    const [selectedImage, setSelectedImage] = useState(0);
    const [bookingData, setBookingData] = useState({
        startDate: '',
        endDate: '',
        withDriver: false,
        notes: '',
    });
    const [showBookingModal, setShowBookingModal] = useState(false);

    if (!car) {
        return (
            <div className="not-found">
                <h2>Mobil tidak ditemukan</h2>
                <Link to="/cars" className="btn btn-primary">Kembali ke Katalog</Link>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const calculateDays = () => {
        if (!bookingData.startDate || !bookingData.endDate) return 0;
        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const totalPrice = calculateDays() * car.pricePerDay + (bookingData.withDriver ? 150000 * calculateDays() : 0);

    const handleBooking = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowBookingModal(true);
    };

    const confirmBooking = () => {
        const booking = {
            userId: user.id,
            carId: car.id,
            carName: car.name,
            carImage: car.images[0],
            ...bookingData,
            days: calculateDays(),
            totalPrice,
        };
        addBooking(booking);
        setShowBookingModal(false);
        navigate('/dashboard/bookings');
    };

    const similarCars = cars
        .filter(c => c.type === car.type && c.id !== car.id)
        .slice(0, 3);

    const favorite = isFavorite(car.id);

    return (
        <div className="car-detail-page">
            {/* Breadcrumb */}
            <section className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <Link to="/">Beranda</Link>
                        <span>/</span>
                        <Link to="/cars">Katalog Mobil</Link>
                        <span>/</span>
                        <span>{car.name}</span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="car-detail-content">
                <div className="container">
                    <div className="car-detail-grid">
                        {/* Gallery */}
                        <div className="car-gallery">
                            <div className="gallery-main">
                                <img src={car.images[selectedImage]} alt={car.name} />
                                <button
                                    className={`gallery-favorite ${favorite ? 'active' : ''}`}
                                    onClick={() => toggleFavorite(car.id)}
                                >
                                    {favorite ? '❤️' : '🤍'}
                                </button>
                            </div>
                            <div className="gallery-thumbnails">
                                {car.images.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={image} alt={`${car.name} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="car-info">
                            <div className="car-info-header">
                                <div className="car-badges">
                                    <span className="badge badge-type">{car.type}</span>
                                    {car.available ? (
                                        <span className="badge badge-success">Tersedia</span>
                                    ) : (
                                        <span className="badge badge-danger">Tidak Tersedia</span>
                                    )}
                                </div>
                                <p className="car-brand">{car.brand}</p>
                                <h1 className="car-name">{car.name}</h1>
                                <div className="car-meta">
                                    <div className="car-rating">
                                        <span>⭐ {car.rating}</span>
                                        <span className="rating-count">({car.reviews} ulasan)</span>
                                    </div>
                                    <div className="car-location">📍 {car.location}</div>
                                </div>
                            </div>

                            <p className="car-description">{car.description}</p>

                            {/* Quick Specs */}
                            <div className="quick-specs">
                                <div className="spec-box">
                                    <span className="spec-icon">📅</span>
                                    <div>
                                        <span className="spec-label">Tahun</span>
                                        <span className="spec-value">{car.year}</span>
                                    </div>
                                </div>
                                <div className="spec-box">
                                    <span className="spec-icon">⚙️</span>
                                    <div>
                                        <span className="spec-label">Transmisi</span>
                                        <span className="spec-value">{car.transmission}</span>
                                    </div>
                                </div>
                                <div className="spec-box">
                                    <span className="spec-icon">⛽</span>
                                    <div>
                                        <span className="spec-label">Bahan Bakar</span>
                                        <span className="spec-value">{car.fuel}</span>
                                    </div>
                                </div>
                                <div className="spec-box">
                                    <span className="spec-icon">👥</span>
                                    <div>
                                        <span className="spec-label">Kapasitas</span>
                                        <span className="spec-value">{car.seats} Kursi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Card */}
                            <div className="price-card">
                                <div className="price-header">
                                    <div className="price-main">
                                        <span className="price-value">{formatPrice(car.pricePerDay)}</span>
                                        <span className="price-unit">/hari</span>
                                    </div>
                                    <div className="price-options">
                                        <span>{formatPrice(car.pricePerWeek)}/minggu</span>
                                        <span>{formatPrice(car.pricePerMonth)}/bulan</span>
                                    </div>
                                </div>

                                <div className="booking-form-inline">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Tanggal Mulai</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={bookingData.startDate}
                                                onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tanggal Selesai</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={bookingData.endDate}
                                                onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                                                min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={bookingData.withDriver}
                                            onChange={(e) => setBookingData({ ...bookingData, withDriver: e.target.checked })}
                                        />
                                        <span>Dengan Supir (+Rp 150.000/hari)</span>
                                    </label>

                                    {calculateDays() > 0 && (
                                        <div className="booking-summary">
                                            <div className="summary-row">
                                                <span>Durasi</span>
                                                <span>{calculateDays()} hari</span>
                                            </div>
                                            <div className="summary-row">
                                                <span>Sewa Mobil</span>
                                                <span>{formatPrice(calculateDays() * car.pricePerDay)}</span>
                                            </div>
                                            {bookingData.withDriver && (
                                                <div className="summary-row">
                                                    <span>Supir</span>
                                                    <span>{formatPrice(150000 * calculateDays())}</span>
                                                </div>
                                            )}
                                            <div className="summary-row total">
                                                <span>Total</span>
                                                <span>{formatPrice(totalPrice)}</span>
                                            </div>
                                        </div>
                                    )}

                                    <button className="btn btn-primary btn-lg btn-block" onClick={handleBooking}>
                                        {user ? 'Booking Sekarang' : 'Login untuk Booking'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Content */}
                    <div className="car-tabs">
                        <div className="tab-content">
                            <h3>Spesifikasi Teknis</h3>
                            <div className="specs-grid">
                                {Object.entries(car.specs).map(([key, value]) => (
                                    <div key={key} className="spec-item-row">
                                        <span className="spec-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="spec-val">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="tab-content">
                            <h3>Fitur & Fasilitas</h3>
                            <div className="features-grid">
                                {car.features.map((feature, index) => (
                                    <div key={index} className="feature-item">
                                        <span className="feature-check">✓</span>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Similar Cars */}
                    {similarCars.length > 0 && (
                        <div className="similar-cars">
                            <h3>Mobil Serupa</h3>
                            <div className="similar-grid">
                                {similarCars.map(car => (
                                    <CarCard key={car.id} car={car} variant="compact" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Konfirmasi Booking</h3>
                            <button className="modal-close" onClick={() => setShowBookingModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="booking-confirm-car">
                                <img src={car.images[0]} alt={car.name} />
                                <div>
                                    <h4>{car.name}</h4>
                                    <p>{car.brand} • {car.year}</p>
                                </div>
                            </div>
                            <div className="booking-confirm-details">
                                <div className="detail-row">
                                    <span>Tanggal</span>
                                    <span>{bookingData.startDate} - {bookingData.endDate}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Durasi</span>
                                    <span>{calculateDays()} hari</span>
                                </div>
                                <div className="detail-row">
                                    <span>Dengan Supir</span>
                                    <span>{bookingData.withDriver ? 'Ya' : 'Tidak'}</span>
                                </div>
                                <div className="detail-row total">
                                    <span>Total Pembayaran</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Catatan (opsional)</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    placeholder="Tambahkan catatan untuk penyewa..."
                                    value={bookingData.notes}
                                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                                Batal
                            </button>
                            <button className="btn btn-primary" onClick={confirmBooking}>
                                Konfirmasi Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
