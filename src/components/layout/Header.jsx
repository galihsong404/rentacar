import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: 'Beranda' },
        { path: '/cars', label: 'Katalog Mobil' },
        { path: '/about', label: 'Tentang Kami' },
        { path: '/contact', label: 'Kontak' },
    ];

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="container header-container">
                {/* Logo */}
                <Link to="/" className="header-logo">
                    <span className="logo-icon">🚗</span>
                    <span className="logo-text">Renta<span className="logo-accent">Car</span></span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="header-actions">
                    {/* Theme Toggle */}
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    {user ? (
                        <div className="user-menu">
                            <button className="user-menu-trigger">
                                <img src={user.avatar} alt={user.name} className="user-avatar" />
                                <span className="user-name">{user.name.split(' ')[0]}</span>
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            <div className="user-dropdown">
                                <div className="user-dropdown-header">
                                    <img src={user.avatar} alt={user.name} />
                                    <div>
                                        <p className="user-dropdown-name">{user.name}</p>
                                        <p className="user-dropdown-email">{user.email}</p>
                                    </div>
                                </div>
                                <div className="user-dropdown-divider"></div>
                                <Link to="/dashboard" className="user-dropdown-item">
                                    <span>📊</span> Dashboard
                                </Link>
                                <Link to="/dashboard/bookings" className="user-dropdown-item">
                                    <span>📋</span> Booking Saya
                                </Link>
                                <Link to="/dashboard/favorites" className="user-dropdown-item">
                                    <span>❤️</span> Favorit
                                </Link>
                                <Link to="/dashboard/profile" className="user-dropdown-item">
                                    <span>👤</span> Profil
                                </Link>
                                {user.role === 'admin' && (
                                    <>
                                        <div className="user-dropdown-divider"></div>
                                        <Link to="/admin" className="user-dropdown-item admin-link">
                                            <span>⚙️</span> Admin Panel
                                        </Link>
                                    </>
                                )}
                                <div className="user-dropdown-divider"></div>
                                <button onClick={handleLogout} className="user-dropdown-item logout">
                                    <span>🚪</span> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-ghost">Login</Link>
                            <Link to="/register" className="btn btn-primary">Daftar</Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {!user && (
                        <>
                            <div className="mobile-nav-divider"></div>
                            <Link to="/login" className="mobile-nav-link">Login</Link>
                            <Link to="/register" className="mobile-nav-link highlight">Daftar Sekarang</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
