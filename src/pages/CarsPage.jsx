import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { cars, categories, brands } from '../data/cars';
import CarCard from '../components/features/CarCard';
import './CarsPage.css';

export default function CarsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Filter states from URL params
    const filters = {
        type: searchParams.get('type') || '',
        brand: searchParams.get('brand') || '',
        transmission: searchParams.get('transmission') || '',
        fuel: searchParams.get('fuel') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        seats: searchParams.get('seats') || '',
        location: searchParams.get('location') || '',
        sort: searchParams.get('sort') || 'popular',
        search: searchParams.get('search') || '',
    };

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    // Filter and sort cars
    const filteredCars = useMemo(() => {
        let result = [...cars];

        // Search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(car =>
                car.name.toLowerCase().includes(searchLower) ||
                car.brand.toLowerCase().includes(searchLower)
            );
        }

        // Type filter
        if (filters.type) {
            result = result.filter(car =>
                car.type.toLowerCase() === filters.type.toLowerCase()
            );
        }

        // Brand filter
        if (filters.brand) {
            result = result.filter(car => car.brand === filters.brand);
        }

        // Transmission filter
        if (filters.transmission) {
            result = result.filter(car => car.transmission === filters.transmission);
        }

        // Fuel filter
        if (filters.fuel) {
            result = result.filter(car => car.fuel === filters.fuel);
        }

        // Seats filter
        if (filters.seats) {
            result = result.filter(car => car.seats >= parseInt(filters.seats));
        }

        // Price filter
        if (filters.minPrice) {
            result = result.filter(car => car.pricePerDay >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice) {
            result = result.filter(car => car.pricePerDay <= parseInt(filters.maxPrice));
        }

        // Location filter
        if (filters.location) {
            result = result.filter(car => car.location === filters.location);
        }

        // Sorting
        switch (filters.sort) {
            case 'price-low':
                result.sort((a, b) => a.pricePerDay - b.pricePerDay);
                break;
            case 'price-high':
                result.sort((a, b) => b.pricePerDay - a.pricePerDay);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                result.sort((a, b) => b.year - a.year);
                break;
            default:
                result.sort((a, b) => b.reviews - a.reviews);
        }

        return result;
    }, [filters]);

    const activeFilterCount = Object.values(filters).filter(v => v && v !== 'popular').length;

    return (
        <div className="cars-page">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <Link to="/">Beranda</Link>
                        <span>/</span>
                        <span>Katalog Mobil</span>
                    </div>
                    <h1 className="page-title">Katalog Mobil</h1>
                    <p className="page-subtitle">Temukan mobil yang sempurna untuk perjalanan Anda</p>
                </div>
            </section>

            {/* Category Pills */}
            <section className="category-pills-section">
                <div className="container">
                    <div className="category-pills">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-pill ${filters.type.toLowerCase() === category.id || (!filters.type && category.id === 'all') ? 'active' : ''}`}
                                onClick={() => updateFilter('type', category.id === 'all' ? '' : category.id)}
                            >
                                <span className="pill-icon">{category.icon}</span>
                                <span className="pill-name">{category.name}</span>
                                <span className="pill-count">{category.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="cars-content">
                <div className="container">
                    <div className="cars-layout">
                        {/* Sidebar Filters */}
                        <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
                            <div className="filters-header">
                                <h3>🔍 Filter</h3>
                                {activeFilterCount > 0 && (
                                    <button className="clear-filters" onClick={clearFilters}>
                                        Reset ({activeFilterCount})
                                    </button>
                                )}
                                <button className="close-filters" onClick={() => setFiltersOpen(false)}>✕</button>
                            </div>

                            {/* Search */}
                            <div className="filter-group">
                                <label className="filter-label">Cari Mobil</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nama atau brand..."
                                    value={filters.search}
                                    onChange={(e) => updateFilter('search', e.target.value)}
                                />
                            </div>

                            {/* Brand */}
                            <div className="filter-group">
                                <label className="filter-label">Brand</label>
                                <select
                                    className="form-input form-select"
                                    value={filters.brand}
                                    onChange={(e) => updateFilter('brand', e.target.value)}
                                >
                                    <option value="">Semua Brand</option>
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Transmission */}
                            <div className="filter-group">
                                <label className="filter-label">Transmisi</label>
                                <div className="filter-buttons">
                                    <button
                                        className={`filter-btn ${!filters.transmission ? 'active' : ''}`}
                                        onClick={() => updateFilter('transmission', '')}
                                    >
                                        Semua
                                    </button>
                                    <button
                                        className={`filter-btn ${filters.transmission === 'Automatic' ? 'active' : ''}`}
                                        onClick={() => updateFilter('transmission', 'Automatic')}
                                    >
                                        Automatic
                                    </button>
                                    <button
                                        className={`filter-btn ${filters.transmission === 'Manual' ? 'active' : ''}`}
                                        onClick={() => updateFilter('transmission', 'Manual')}
                                    >
                                        Manual
                                    </button>
                                </div>
                            </div>

                            {/* Fuel */}
                            <div className="filter-group">
                                <label className="filter-label">Bahan Bakar</label>
                                <select
                                    className="form-input form-select"
                                    value={filters.fuel}
                                    onChange={(e) => updateFilter('fuel', e.target.value)}
                                >
                                    <option value="">Semua</option>
                                    <option value="Bensin">Bensin</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>

                            {/* Seats */}
                            <div className="filter-group">
                                <label className="filter-label">Kapasitas (min)</label>
                                <select
                                    className="form-input form-select"
                                    value={filters.seats}
                                    onChange={(e) => updateFilter('seats', e.target.value)}
                                >
                                    <option value="">Semua</option>
                                    <option value="2">2+ Kursi</option>
                                    <option value="4">4+ Kursi</option>
                                    <option value="5">5+ Kursi</option>
                                    <option value="7">7+ Kursi</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="filter-group">
                                <label className="filter-label">Range Harga (per hari)</label>
                                <div className="price-inputs">
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                    />
                                </div>
                            </div>
                        </aside>

                        {/* Cars Grid */}
                        <div className="cars-main">
                            {/* Toolbar */}
                            <div className="cars-toolbar">
                                <div className="toolbar-left">
                                    <button className="filter-toggle" onClick={() => setFiltersOpen(true)}>
                                        🔍 Filter
                                        {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
                                    </button>
                                    <span className="results-count">
                                        <strong>{filteredCars.length}</strong> mobil ditemukan
                                    </span>
                                </div>
                                <div className="toolbar-right">
                                    <select
                                        className="sort-select"
                                        value={filters.sort}
                                        onChange={(e) => updateFilter('sort', e.target.value)}
                                    >
                                        <option value="popular">Paling Populer</option>
                                        <option value="price-low">Harga: Rendah ke Tinggi</option>
                                        <option value="price-high">Harga: Tinggi ke Rendah</option>
                                        <option value="rating">Rating Tertinggi</option>
                                        <option value="newest">Terbaru</option>
                                    </select>
                                    <div className="view-toggle">
                                        <button
                                            className={viewMode === 'grid' ? 'active' : ''}
                                            onClick={() => setViewMode('grid')}
                                            aria-label="Grid view"
                                        >
                                            ▦
                                        </button>
                                        <button
                                            className={viewMode === 'list' ? 'active' : ''}
                                            onClick={() => setViewMode('list')}
                                            aria-label="List view"
                                        >
                                            ☰
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Cars List */}
                            {filteredCars.length > 0 ? (
                                <div className={`cars-grid-list ${viewMode}`}>
                                    {filteredCars.map(car => (
                                        <CarCard
                                            key={car.id}
                                            car={car}
                                            variant={viewMode === 'list' ? 'horizontal' : 'default'}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-results">
                                    <div className="no-results-icon">🚗</div>
                                    <h3>Tidak ada mobil ditemukan</h3>
                                    <p>Coba ubah filter pencarian Anda</p>
                                    <button className="btn btn-primary" onClick={clearFilters}>
                                        Reset Filter
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Overlay for mobile filters */}
            {filtersOpen && <div className="filters-overlay" onClick={() => setFiltersOpen(false)}></div>}
        </div>
    );
}
