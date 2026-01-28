import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { carsApi, usersApi, bookingsApi, locationsApi, settingsApi } from '../lib/supabase';
import './AdminPage.css';

// Loading Spinner Component
function Spinner() {
    return <div className="spinner"></div>;
}

// Modal Component
function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${size}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

// =================== OVERVIEW TAB ===================
function OverviewTab({ stats, recentBookings, onStatusChange }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="admin-overview">
            {/* Stats Cards */}
            <div className="admin-stats">
                <div className="admin-stat-card primary">
                    <div className="stat-content">
                        <span className="stat-value">{stats.totalCars}</span>
                        <span className="stat-label">Total Mobil</span>
                    </div>
                    <span className="stat-icon">🚗</span>
                </div>
                <div className="admin-stat-card success">
                    <div className="stat-content">
                        <span className="stat-value">{stats.totalBookings}</span>
                        <span className="stat-label">Total Booking</span>
                    </div>
                    <span className="stat-icon">📋</span>
                </div>
                <div className="admin-stat-card warning">
                    <div className="stat-content">
                        <span className="stat-value">{stats.pendingBookings}</span>
                        <span className="stat-label">Menunggu Konfirmasi</span>
                    </div>
                    <span className="stat-icon">⏳</span>
                </div>
                <div className="admin-stat-card info">
                    <div className="stat-content">
                        <span className="stat-value">{formatPrice(stats.revenue)}</span>
                        <span className="stat-label">Total Pendapatan</span>
                    </div>
                    <span className="stat-icon">💰</span>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="admin-section">
                <h3>📋 Booking Terbaru</h3>
                {recentBookings.length > 0 ? (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pelanggan</th>
                                    <th>Mobil</th>
                                    <th>Tanggal</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.slice(0, 5).map(booking => (
                                    <tr key={booking.id}>
                                        <td>#{booking.id.slice(-6)}</td>
                                        <td>{booking.user?.name || 'N/A'}</td>
                                        <td>{booking.car?.name || 'N/A'}</td>
                                        <td>{booking.start_date}</td>
                                        <td>{formatPrice(booking.total_price)}</td>
                                        <td>
                                            <span className={`badge badge-${booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'success' : booking.status === 'completed' ? 'primary' : 'danger'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="status-select"
                                                value={booking.status}
                                                onChange={(e) => onStatusChange(booking.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-data">Belum ada booking</p>
                )}
            </div>
        </div>
    );
}

// =================== USERS TAB ===================
function UsersTab({ users, onEdit, onDelete, loading }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-users">
            <div className="admin-section">
                <div className="section-header">
                    <h3>👥 Daftar Pengguna ({users.length})</h3>
                    <input
                        type="search"
                        className="search-input"
                        placeholder="Cari pengguna..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? <Spinner /> : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Pengguna</th>
                                    <th>Email</th>
                                    <th>Telepon</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Terdaftar</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="table-user">
                                                <img src={user.avatar || 'https://i.pravatar.cc/40?u=' + user.id} alt={user.name} />
                                                <span>{user.name}</span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || '-'}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {user.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(user)}>✏️</button>
                                                <button className="btn btn-ghost btn-sm danger" onClick={() => onDelete(user.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// =================== CARS TAB ===================
function CarsTab({ cars, onAdd, onEdit, onDelete, loading }) {
    const [searchTerm, setSearchTerm] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const filteredCars = cars.filter(car =>
        car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-cars">
            <div className="admin-section">
                <div className="section-header">
                    <h3>🚗 Daftar Mobil ({cars.length})</h3>
                    <div className="section-actions">
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Cari mobil..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-primary btn-sm" onClick={onAdd}>
                            + Tambah Mobil
                        </button>
                    </div>
                </div>

                {loading ? <Spinner /> : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Mobil</th>
                                    <th>Tipe</th>
                                    <th>Tahun</th>
                                    <th>Transmisi</th>
                                    <th>Harga/Hari</th>
                                    <th>Rating</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map(car => (
                                    <tr key={car.id}>
                                        <td>
                                            <div className="table-car">
                                                <img src={car.images?.[0] || 'https://via.placeholder.com/60x40'} alt={car.name} />
                                                <div>
                                                    <span className="car-name">{car.name}</span>
                                                    <span className="car-brand">{car.brand}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{car.type}</td>
                                        <td>{car.year}</td>
                                        <td>{car.transmission}</td>
                                        <td>{formatPrice(car.price_per_day)}</td>
                                        <td>⭐ {car.rating || 0}</td>
                                        <td>
                                            <span className={`badge ${car.available ? 'badge-success' : 'badge-danger'}`}>
                                                {car.available ? 'Tersedia' : 'Tidak Tersedia'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(car)}>✏️</button>
                                                <button className="btn btn-ghost btn-sm danger" onClick={() => onDelete(car.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// =================== BOOKINGS TAB ===================
function BookingsTab({ bookings, onView, onStatusChange, loading }) {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const matchesSearch =
            booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.car?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="admin-bookings">
            <div className="admin-section">
                <div className="section-header">
                    <h3>📋 Semua Booking ({bookings.length})</h3>
                    <div className="section-actions">
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Cari booking..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? <Spinner /> : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pelanggan</th>
                                    <th>Mobil</th>
                                    <th>Tanggal Mulai</th>
                                    <th>Tanggal Selesai</th>
                                    <th>Durasi</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td>#{booking.id.slice(-6)}</td>
                                        <td>
                                            <div className="table-user-mini">
                                                <span>{booking.user?.name || 'N/A'}</span>
                                                <small>{booking.user?.email}</small>
                                            </div>
                                        </td>
                                        <td>{booking.car?.name || 'N/A'}</td>
                                        <td>{booking.start_date}</td>
                                        <td>{booking.end_date}</td>
                                        <td>{booking.days} hari</td>
                                        <td>{formatPrice(booking.total_price)}</td>
                                        <td>
                                            <span className={`badge badge-${booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'success' : booking.status === 'completed' ? 'primary' : 'danger'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn btn-ghost btn-sm" onClick={() => onView(booking)} title="Lihat Detail">👁️</button>
                                                <select
                                                    className="status-select mini"
                                                    value={booking.status}
                                                    onChange={(e) => onStatusChange(booking.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// =================== LOCATIONS TAB ===================
function LocationsTab({ locations, onAdd, onEdit, onDelete, loading }) {
    return (
        <div className="admin-locations">
            <div className="admin-section">
                <div className="section-header">
                    <h3>📍 Lokasi Pickup ({locations.length})</h3>
                    <button className="btn btn-primary btn-sm" onClick={onAdd}>
                        + Tambah Lokasi
                    </button>
                </div>

                {loading ? <Spinner /> : (
                    <div className="locations-grid">
                        {locations.map(location => (
                            <div key={location.id} className="location-card">
                                <div className="location-info">
                                    <h4>{location.name}</h4>
                                    <p>{location.address}</p>
                                    <span className="location-city">{location.city}</span>
                                </div>
                                <div className="location-actions">
                                    <button className="btn btn-ghost btn-sm" onClick={() => onEdit(location)}>✏️</button>
                                    <button className="btn btn-ghost btn-sm danger" onClick={() => onDelete(location.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// =================== SETTINGS TAB ===================
function SettingsTab({ settings, onSave, loading }) {
    const [formData, setFormData] = useState(settings || {});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings) setFormData(settings);
    }, [settings]);

    const handleSave = async () => {
        setSaving(true);
        await onSave(formData);
        setSaving(false);
    };

    return (
        <div className="admin-settings">
            <div className="admin-section">
                <h3>⚙️ Pengaturan Situs</h3>

                {loading ? <Spinner /> : (
                    <div className="settings-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Nama Situs</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.site_name || ''}
                                    onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Kontak</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.contact_email || ''}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Telepon Kontak</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.contact_phone || ''}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Biaya Driver/Hari (Rp)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.driver_fee_per_day || 0}
                                    onChange={(e) => setFormData({ ...formData, driver_fee_per_day: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Alamat Kantor</label>
                            <textarea
                                className="form-input"
                                rows="2"
                                value={formData.contact_address || ''}
                                onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Deskripsi Situs</label>
                            <textarea
                                className="form-input"
                                rows="3"
                                value={formData.site_description || ''}
                                onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Min. Hari Sewa</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.min_rental_days || 1}
                                    onChange={(e) => setFormData({ ...formData, min_rental_days: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max. Hari Sewa</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.max_rental_days || 30}
                                    onChange={(e) => setFormData({ ...formData, max_rental_days: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <h4>Social Media</h4>
                        <div className="form-row three">
                            <div className="form-group">
                                <label className="form-label">Facebook</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://facebook.com/..."
                                    value={formData.social_facebook || ''}
                                    onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Instagram</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://instagram.com/..."
                                    value={formData.social_instagram || ''}
                                    onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Twitter</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="https://twitter.com/..."
                                    value={formData.social_twitter || ''}
                                    onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// =================== MAIN ADMIN COMPONENT ===================
export default function AdminPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Data states
    const [cars, setCars] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [locations, setLocations] = useState([]);
    const [settings, setSettings] = useState({});
    const [stats, setStats] = useState({
        totalCars: 0,
        totalBookings: 0,
        pendingBookings: 0,
        revenue: 0
    });

    // Modal states
    const [showCarModal, setShowCarModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Redirect non-admin users
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    // Fetch all data on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [carsData, usersData, bookingsData, locationsData, settingsData] = await Promise.all([
                carsApi.getAll(),
                usersApi.getAll(),
                bookingsApi.getAll(),
                locationsApi.getAll(),
                settingsApi.get()
            ]);

            setCars(carsData || []);
            setUsers(usersData || []);
            setBookings(bookingsData || []);
            setLocations(locationsData || []);
            setSettings(settingsData || {});

            // Calculate stats
            setStats({
                totalCars: carsData?.length || 0,
                totalBookings: bookingsData?.length || 0,
                pendingBookings: bookingsData?.filter(b => b.status === 'pending').length || 0,
                revenue: bookingsData
                    ?.filter(b => b.status !== 'cancelled')
                    .reduce((sum, b) => sum + (b.total_price || 0), 0) || 0
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            showMessage('error', 'Gagal memuat data dari database');
        }
        setLoading(false);
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // ===== BOOKING HANDLERS =====
    const handleBookingStatusChange = async (bookingId, newStatus) => {
        try {
            await bookingsApi.update(bookingId, { status: newStatus });
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));
            showMessage('success', 'Status booking berhasil diupdate');
        } catch (error) {
            showMessage('error', 'Gagal mengupdate status booking');
        }
    };

    const handleViewBooking = (booking) => {
        setEditingItem(booking);
        setShowBookingModal(true);
    };

    // ===== USER HANDLERS =====
    const handleEditUser = (user) => {
        setEditingItem(user);
        setShowUserModal(true);
    };

    const handleSaveUser = async (userData) => {
        try {
            if (editingItem) {
                await usersApi.update(editingItem.id, userData);
                setUsers(prev => prev.map(u =>
                    u.id === editingItem.id ? { ...u, ...userData } : u
                ));
                showMessage('success', 'User berhasil diupdate');
            }
            setShowUserModal(false);
            setEditingItem(null);
        } catch (error) {
            showMessage('error', 'Gagal menyimpan user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Yakin ingin menghapus user ini?')) return;
        try {
            await usersApi.delete(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            showMessage('success', 'User berhasil dihapus');
        } catch (error) {
            showMessage('error', 'Gagal menghapus user');
        }
    };

    // ===== CAR HANDLERS =====
    const handleAddCar = () => {
        setEditingItem(null);
        setShowCarModal(true);
    };

    const handleEditCar = (car) => {
        setEditingItem(car);
        setShowCarModal(true);
    };

    const handleSaveCar = async (carData) => {
        try {
            if (editingItem) {
                const updated = await carsApi.update(editingItem.id, carData);
                setCars(prev => prev.map(c => c.id === editingItem.id ? updated : c));
                showMessage('success', 'Mobil berhasil diupdate');
            } else {
                const created = await carsApi.create(carData);
                setCars(prev => [created, ...prev]);
                showMessage('success', 'Mobil berhasil ditambahkan');
            }
            setShowCarModal(false);
            setEditingItem(null);
        } catch (error) {
            showMessage('error', 'Gagal menyimpan mobil');
        }
    };

    const handleDeleteCar = async (carId) => {
        if (!confirm('Yakin ingin menghapus mobil ini?')) return;
        try {
            await carsApi.delete(carId);
            setCars(prev => prev.filter(c => c.id !== carId));
            showMessage('success', 'Mobil berhasil dihapus');
        } catch (error) {
            showMessage('error', 'Gagal menghapus mobil');
        }
    };

    // ===== LOCATION HANDLERS =====
    const handleAddLocation = () => {
        setEditingItem(null);
        setShowLocationModal(true);
    };

    const handleEditLocation = (location) => {
        setEditingItem(location);
        setShowLocationModal(true);
    };

    const handleSaveLocation = async (locationData) => {
        try {
            if (editingItem) {
                const updated = await locationsApi.update(editingItem.id, locationData);
                setLocations(prev => prev.map(l => l.id === editingItem.id ? updated : l));
                showMessage('success', 'Lokasi berhasil diupdate');
            } else {
                const created = await locationsApi.create(locationData);
                setLocations(prev => [created, ...prev]);
                showMessage('success', 'Lokasi berhasil ditambahkan');
            }
            setShowLocationModal(false);
            setEditingItem(null);
        } catch (error) {
            showMessage('error', 'Gagal menyimpan lokasi');
        }
    };

    const handleDeleteLocation = async (locationId) => {
        if (!confirm('Yakin ingin menghapus lokasi ini?')) return;
        try {
            await locationsApi.delete(locationId);
            setLocations(prev => prev.filter(l => l.id !== locationId));
            showMessage('success', 'Lokasi berhasil dihapus');
        } catch (error) {
            showMessage('error', 'Gagal menghapus lokasi');
        }
    };

    // ===== SETTINGS HANDLER =====
    const handleSaveSettings = async (settingsData) => {
        try {
            await settingsApi.update(settingsData);
            setSettings(settingsData);
            showMessage('success', 'Pengaturan berhasil disimpan');
        } catch (error) {
            showMessage('error', 'Gagal menyimpan pengaturan');
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                {/* Header */}
                <div className="admin-header">
                    <div>
                        <h1>🛠️ Admin Dashboard</h1>
                        <p>Kelola mobil, booking, pengguna, dan pengaturan</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={fetchAllData} disabled={loading}>
                            🔄 Refresh Data
                        </button>
                        <Link to="/dashboard" className="btn btn-ghost">
                            ← Kembali
                        </Link>
                    </div>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Pengguna ({users.length})
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'cars' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cars')}
                    >
                        🚗 Mobil ({cars.length})
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        📋 Booking ({bookings.length})
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'locations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('locations')}
                    >
                        📍 Lokasi ({locations.length})
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        ⚙️ Pengaturan
                    </button>
                </div>

                {/* Content */}
                <div className="admin-content">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            stats={stats}
                            recentBookings={bookings}
                            onStatusChange={handleBookingStatusChange}
                        />
                    )}
                    {activeTab === 'users' && (
                        <UsersTab
                            users={users}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                            loading={loading}
                        />
                    )}
                    {activeTab === 'cars' && (
                        <CarsTab
                            cars={cars}
                            onAdd={handleAddCar}
                            onEdit={handleEditCar}
                            onDelete={handleDeleteCar}
                            loading={loading}
                        />
                    )}
                    {activeTab === 'bookings' && (
                        <BookingsTab
                            bookings={bookings}
                            onView={handleViewBooking}
                            onStatusChange={handleBookingStatusChange}
                            loading={loading}
                        />
                    )}
                    {activeTab === 'locations' && (
                        <LocationsTab
                            locations={locations}
                            onAdd={handleAddLocation}
                            onEdit={handleEditLocation}
                            onDelete={handleDeleteLocation}
                            loading={loading}
                        />
                    )}
                    {activeTab === 'settings' && (
                        <SettingsTab
                            settings={settings}
                            onSave={handleSaveSettings}
                            loading={loading}
                        />
                    )}
                </div>
            </div>

            {/* ===== MODALS ===== */}

            {/* User Edit Modal */}
            <Modal
                isOpen={showUserModal}
                onClose={() => { setShowUserModal(false); setEditingItem(null); }}
                title={editingItem ? 'Edit Pengguna' : 'Tambah Pengguna'}
            >
                <UserForm
                    user={editingItem}
                    onSave={handleSaveUser}
                    onCancel={() => { setShowUserModal(false); setEditingItem(null); }}
                />
            </Modal>

            {/* Car Edit Modal */}
            <Modal
                isOpen={showCarModal}
                onClose={() => { setShowCarModal(false); setEditingItem(null); }}
                title={editingItem ? 'Edit Mobil' : 'Tambah Mobil'}
                size="large"
            >
                <CarForm
                    car={editingItem}
                    onSave={handleSaveCar}
                    onCancel={() => { setShowCarModal(false); setEditingItem(null); }}
                />
            </Modal>

            {/* Booking Detail Modal */}
            <Modal
                isOpen={showBookingModal}
                onClose={() => { setShowBookingModal(false); setEditingItem(null); }}
                title="Detail Booking"
            >
                {editingItem && <BookingDetail booking={editingItem} />}
            </Modal>

            {/* Location Edit Modal */}
            <Modal
                isOpen={showLocationModal}
                onClose={() => { setShowLocationModal(false); setEditingItem(null); }}
                title={editingItem ? 'Edit Lokasi' : 'Tambah Lokasi'}
            >
                <LocationForm
                    location={editingItem}
                    onSave={handleSaveLocation}
                    onCancel={() => { setShowLocationModal(false); setEditingItem(null); }}
                />
            </Modal>
        </div>
    );
}

// =================== FORM COMPONENTS ===================

function UserForm({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'user',
        is_active: user?.is_active ?? true,
    });

    return (
        <div className="form-content">
            <div className="form-group">
                <label className="form-label">Nama</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Telepon</label>
                <input
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                        className="form-input"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                        className="form-input"
                        value={formData.is_active ? 'active' : 'inactive'}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                    >
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                    </select>
                </div>
            </div>
            <div className="form-actions">
                <button className="btn btn-secondary" onClick={onCancel}>Batal</button>
                <button className="btn btn-primary" onClick={() => onSave(formData)}>Simpan</button>
            </div>
        </div>
    );
}

function CarForm({ car, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: car?.name || '',
        brand: car?.brand || '',
        type: car?.type || 'Sedan',
        year: car?.year || new Date().getFullYear(),
        transmission: car?.transmission || 'Automatic',
        fuel: car?.fuel || 'Bensin',
        seats: car?.seats || 5,
        price_per_day: car?.price_per_day || 0,
        price_per_week: car?.price_per_week || 0,
        price_per_month: car?.price_per_month || 0,
        available: car?.available ?? true,
        featured: car?.featured ?? false,
        description: car?.description || '',
        location: car?.location || '',
        images: car?.images || [],
        features: car?.features || [],
    });

    const [imageInput, setImageInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');

    const addImage = () => {
        if (imageInput.trim()) {
            setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
            setImageInput('');
        }
    };

    const removeImage = (index) => {
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
    };

    return (
        <div className="form-content car-form">
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nama Mobil *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Merek *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="form-row three">
                <div className="form-group">
                    <label className="form-label">Tipe</label>
                    <select
                        className="form-input"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="MPV">MPV</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sport">Sport</option>
                        <option value="Electric">Electric</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Tahun</label>
                    <input
                        type="number"
                        className="form-input"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Kapasitas</label>
                    <input
                        type="number"
                        className="form-input"
                        value={formData.seats}
                        onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Transmisi</label>
                    <select
                        className="form-input"
                        value={formData.transmission}
                        onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Bahan Bakar</label>
                    <select
                        className="form-input"
                        value={formData.fuel}
                        onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    >
                        <option value="Bensin">Bensin</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>
            </div>

            <div className="form-row three">
                <div className="form-group">
                    <label className="form-label">Harga/Hari (Rp) *</label>
                    <input
                        type="number"
                        className="form-input"
                        value={formData.price_per_day}
                        onChange={(e) => setFormData({ ...formData, price_per_day: parseInt(e.target.value) })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Harga/Minggu (Rp)</label>
                    <input
                        type="number"
                        className="form-input"
                        value={formData.price_per_week}
                        onChange={(e) => setFormData({ ...formData, price_per_week: parseInt(e.target.value) })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Harga/Bulan (Rp)</label>
                    <input
                        type="number"
                        className="form-input"
                        value={formData.price_per_month}
                        onChange={(e) => setFormData({ ...formData, price_per_month: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Lokasi</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                    className="form-input"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            {/* Images */}
            <div className="form-group">
                <label className="form-label">Gambar (URL)</label>
                <div className="input-with-button">
                    <input
                        type="url"
                        className="form-input"
                        placeholder="https://example.com/image.jpg"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                    />
                    <button type="button" className="btn btn-secondary" onClick={addImage}>+ Tambah</button>
                </div>
                <div className="image-preview-list">
                    {formData.images.map((img, i) => (
                        <div key={i} className="image-preview-item">
                            <img src={img} alt={`Preview ${i + 1}`} />
                            <button className="remove-btn" onClick={() => removeImage(i)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="form-group">
                <label className="form-label">Fitur</label>
                <div className="input-with-button">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Contoh: AC, Bluetooth, GPS"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                    />
                    <button type="button" className="btn btn-secondary" onClick={addFeature}>+ Tambah</button>
                </div>
                <div className="tags-list">
                    {formData.features.map((feat, i) => (
                        <span key={i} className="tag">
                            {feat}
                            <button onClick={() => removeFeature(i)}>×</button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="form-row">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={formData.available}
                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    />
                    <span>Tersedia untuk disewa</span>
                </label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Tampilkan di Featured</span>
                </label>
            </div>

            <div className="form-actions">
                <button className="btn btn-secondary" onClick={onCancel}>Batal</button>
                <button className="btn btn-primary" onClick={() => onSave(formData)}>Simpan</button>
            </div>
        </div>
    );
}

function LocationForm({ location, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: location?.name || '',
        city: location?.city || '',
        address: location?.address || '',
        is_active: location?.is_active ?? true,
    });

    return (
        <div className="form-content">
            <div className="form-group">
                <label className="form-label">Nama Lokasi *</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Kota *</label>
                <input
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Alamat Lengkap</label>
                <textarea
                    className="form-input"
                    rows="2"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
            </div>
            <label className="checkbox-label">
                <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <span>Lokasi Aktif</span>
            </label>
            <div className="form-actions">
                <button className="btn btn-secondary" onClick={onCancel}>Batal</button>
                <button className="btn btn-primary" onClick={() => onSave(formData)}>Simpan</button>
            </div>
        </div>
    );
}

function BookingDetail({ booking }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="booking-detail">
            <div className="detail-section">
                <h4>📋 Informasi Booking</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span className="label">ID Booking</span>
                        <span className="value">#{booking.id}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Status</span>
                        <span className={`badge badge-${booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'success' : booking.status === 'completed' ? 'primary' : 'danger'}`}>
                            {booking.status}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Tanggal Booking</span>
                        <span className="value">{new Date(booking.created_at).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h4>👤 Pelanggan</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span className="label">Nama</span>
                        <span className="value">{booking.user?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Email</span>
                        <span className="value">{booking.user?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Telepon</span>
                        <span className="value">{booking.user?.phone || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h4>🚗 Detail Rental</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span className="label">Mobil</span>
                        <span className="value">{booking.car?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Tanggal Mulai</span>
                        <span className="value">{booking.start_date}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Tanggal Selesai</span>
                        <span className="value">{booking.end_date}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Durasi</span>
                        <span className="value">{booking.days} hari</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Dengan Driver</span>
                        <span className="value">{booking.with_driver ? 'Ya' : 'Tidak'}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h4>💰 Pembayaran</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span className="label">Subtotal</span>
                        <span className="value">{formatPrice(booking.subtotal || 0)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Biaya Driver</span>
                        <span className="value">{formatPrice(booking.driver_fee || 0)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Total</span>
                        <span className="value total">{formatPrice(booking.total_price)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Status Pembayaran</span>
                        <span className={`badge badge-${booking.payment_status === 'paid' ? 'success' : 'warning'}`}>
                            {booking.payment_status || 'unpaid'}
                        </span>
                    </div>
                </div>
            </div>

            {booking.notes && (
                <div className="detail-section">
                    <h4>📝 Catatan</h4>
                    <p>{booking.notes}</p>
                </div>
            )}
        </div>
    );
}
