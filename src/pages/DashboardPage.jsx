import { useState } from 'react';
import { Link, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { cars } from '../data/cars';
import CarCard from '../components/features/CarCard';
import './DashboardPage.css';

// Dashboard Overview
function DashboardOverview() {
    const { user } = useAuth();
    const { getUserBookings, favorites } = useBooking();
    const userBookings = getUserBookings(user?.id);

    const activeBookings = userBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
    const completedBookings = userBookings.filter(b => b.status === 'completed');

    return (
        <div className="dashboard-overview">
            <div className="welcome-banner">
                <div className="welcome-content">
                    <h2>Selamat datang, {user?.name}! 👋</h2>
                    <p>Kelola booking dan temukan mobil impian Anda</p>
                </div>
                <Link to="/cars" className="btn btn-primary">
                    Cari Mobil →
                </Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <span className="stat-number">{activeBookings.length}</span>
                        <span className="stat-label">Booking Aktif</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <span className="stat-number">{completedBookings.length}</span>
                        <span className="stat-label">Selesai</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">❤️</div>
                    <div className="stat-info">
                        <span className="stat-number">{favorites.length}</span>
                        <span className="stat-label">Favorit</span>
                    </div>
                </div>
            </div>

            {activeBookings.length > 0 && (
                <div className="dashboard-section">
                    <div className="section-header">
                        <h3>Booking Aktif</h3>
                        <Link to="/dashboard/bookings" className="link">Lihat Semua</Link>
                    </div>
                    <div className="bookings-list">
                        {activeBookings.slice(0, 2).map(booking => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Booking Card Component
function BookingCard({ booking }) {
    const { updateBooking, cancelBooking } = useBooking();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: 'Menunggu', class: 'badge-warning' },
            confirmed: { label: 'Dikonfirmasi', class: 'badge-success' },
            completed: { label: 'Selesai', class: 'badge-primary' },
            cancelled: { label: 'Dibatalkan', class: 'badge-danger' },
        };
        return statusMap[status] || statusMap.pending;
    };

    const status = getStatusBadge(booking.status);

    return (
        <div className="booking-card">
            <img src={booking.carImage} alt={booking.carName} className="booking-car-image" />
            <div className="booking-info">
                <div className="booking-header">
                    <h4>{booking.carName}</h4>
                    <span className={`badge ${status.class}`}>{status.label}</span>
                </div>
                <div className="booking-meta">
                    <span>📅 {booking.startDate} - {booking.endDate}</span>
                    <span>🕐 {booking.days} hari</span>
                </div>
                <div className="booking-footer">
                    <span className="booking-price">{formatPrice(booking.totalPrice)}</span>
                    {booking.status === 'pending' && (
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => cancelBooking(booking.id)}
                        >
                            Batalkan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Bookings List
function BookingsList() {
    const { user } = useAuth();
    const { getUserBookings } = useBooking();
    const userBookings = getUserBookings(user?.id);

    return (
        <div className="bookings-page">
            <h2>Booking Saya</h2>
            {userBookings.length > 0 ? (
                <div className="bookings-list">
                    {userBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>Belum ada booking</h3>
                    <p>Mulai booking mobil pertama Anda</p>
                    <Link to="/cars" className="btn btn-primary">Cari Mobil</Link>
                </div>
            )}
        </div>
    );
}

// Favorites List
function FavoritesList() {
    const { favorites } = useBooking();
    const favoriteCars = cars.filter(car => favorites.includes(car.id));

    return (
        <div className="favorites-page">
            <h2>Favorit Saya</h2>
            {favoriteCars.length > 0 ? (
                <div className="favorites-grid">
                    {favoriteCars.map(car => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">❤️</div>
                    <h3>Belum ada favorit</h3>
                    <p>Simpan mobil favorit Anda untuk akses cepat</p>
                    <Link to="/cars" className="btn btn-primary">Jelajahi Mobil</Link>
                </div>
            )}
        </div>
    );
}

// Profile Page
function ProfilePage() {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleSave = () => {
        updateProfile(formData);
        setEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="profile-page">
            <h2>Profil Saya</h2>
            <div className="profile-card">
                <div className="profile-header">
                    <img src={user?.avatar} alt={user?.name} className="profile-avatar" />
                    <div className="profile-info">
                        <h3>{user?.name}</h3>
                        <p>{user?.email}</p>
                        <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                            {user?.role === 'admin' ? 'Administrator' : 'Member'}
                        </span>
                    </div>
                </div>

                <div className="profile-form">
                    <div className="form-group">
                        <label className="form-label">Nama Lengkap</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!editing}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!editing}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nomor Telepon</label>
                        <input
                            type="tel"
                            className="form-input"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!editing}
                        />
                    </div>

                    <div className="profile-actions">
                        {editing ? (
                            <>
                                <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
                                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Batal</button>
                            </>
                        ) : (
                            <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profil</button>
                        )}
                    </div>
                </div>

                <div className="profile-footer">
                    <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main Dashboard
export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-layout">
                    {/* Sidebar */}
                    <aside className="dashboard-sidebar">
                        <div className="sidebar-user">
                            <img src={user.avatar} alt={user.name} className="sidebar-avatar" />
                            <div className="sidebar-user-info">
                                <h4>{user.name}</h4>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <nav className="sidebar-nav">
                            <Link to="/dashboard" className="sidebar-link">
                                <span className="link-icon">📊</span>
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/dashboard/bookings" className="sidebar-link">
                                <span className="link-icon">📋</span>
                                <span>Booking Saya</span>
                            </Link>
                            <Link to="/dashboard/favorites" className="sidebar-link">
                                <span className="link-icon">❤️</span>
                                <span>Favorit</span>
                            </Link>
                            <Link to="/dashboard/profile" className="sidebar-link">
                                <span className="link-icon">👤</span>
                                <span>Profil</span>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="sidebar-link admin">
                                    <span className="link-icon">⚙️</span>
                                    <span>Admin Panel</span>
                                </Link>
                            )}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="dashboard-main">
                        <Routes>
                            <Route index element={<DashboardOverview />} />
                            <Route path="bookings" element={<BookingsList />} />
                            <Route path="favorites" element={<FavoritesList />} />
                            <Route path="profile" element={<ProfilePage />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </div>
    );
}
