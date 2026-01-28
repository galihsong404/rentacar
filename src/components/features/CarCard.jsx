import { Link } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import './CarCard.css';

export default function CarCard({ car, variant = 'default' }) {
    const { toggleFavorite, isFavorite } = useBooking();
    const favorite = isFavorite(car.id);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className={`car-card ${variant}`}>
            {/* Image */}
            <div className="car-card-image">
                <img src={car.images[0]} alt={car.name} loading="lazy" />

                {/* Badges */}
                <div className="car-card-badges">
                    {car.featured && <span className="badge badge-featured">⭐ Featured</span>}
                    {car.type === 'Electric' && <span className="badge badge-electric">⚡ Electric</span>}
                </div>

                {/* Favorite Button */}
                <button
                    className={`favorite-btn ${favorite ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(car.id);
                    }}
                    aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {favorite ? '❤️' : '🤍'}
                </button>

                {/* Overlay */}
                <div className="car-card-overlay">
                    <Link to={`/cars/${car.id}`} className="btn btn-primary">
                        Lihat Detail
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="car-card-content">
                <div className="car-card-header">
                    <div>
                        <p className="car-brand">{car.brand}</p>
                        <h3 className="car-name">{car.name}</h3>
                    </div>
                    <div className="car-rating">
                        <span className="rating-star">⭐</span>
                        <span className="rating-value">{car.rating}</span>
                        <span className="rating-count">({car.reviews})</span>
                    </div>
                </div>

                {/* Specs */}
                <div className="car-specs">
                    <div className="spec-item">
                        <span className="spec-icon">⚙️</span>
                        <span>{car.transmission}</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-icon">⛽</span>
                        <span>{car.fuel}</span>
                    </div>
                    <div className="spec-item">
                        <span className="spec-icon">👥</span>
                        <span>{car.seats} Kursi</span>
                    </div>
                </div>

                {/* Price */}
                <div className="car-card-footer">
                    <div className="car-price">
                        <span className="price-value">{formatPrice(car.pricePerDay)}</span>
                        <span className="price-unit">/hari</span>
                    </div>
                    <Link to={`/cars/${car.id}`} className="btn btn-outline btn-sm">
                        Sewa Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}
