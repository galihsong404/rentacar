import { createContext, useContext, useState, useEffect } from 'react';
import { bookingsApi, favoritesApi } from '../lib/supabase';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export function BookingProvider({ children }) {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user bookings and favorites when user changes
    useEffect(() => {
        if (user?.id) {
            fetchUserData();
        } else {
            setBookings([]);
            setFavorites([]);
        }
    }, [user?.id]);

    const fetchUserData = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const [userBookings, userFavorites] = await Promise.all([
                bookingsApi.getByUserId(user.id),
                favoritesApi.getByUserId(user.id)
            ]);

            setBookings(userBookings || []);
            setFavorites(userFavorites?.map(f => f.car_id) || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        setLoading(false);
    };

    // Create booking
    const createBooking = async (bookingData) => {
        if (!user?.id) return { success: false, error: 'Silakan login terlebih dahulu' };

        try {
            const newBooking = await bookingsApi.create({
                ...bookingData,
                user_id: user.id,
                status: 'pending',
                payment_status: 'unpaid',
            });

            setBookings(prev => [newBooking, ...prev]);
            return { success: true, booking: newBooking };
        } catch (error) {
            console.error('Create booking error:', error);
            return { success: false, error: 'Gagal membuat booking' };
        }
    };

    // Get user bookings
    const getUserBookings = () => {
        return bookings;
    };

    // Get all bookings (for admin)
    const getAllBookings = async () => {
        try {
            return await bookingsApi.getAll();
        } catch (error) {
            console.error('Get all bookings error:', error);
            return [];
        }
    };

    // Update booking
    const updateBooking = async (bookingId, updates) => {
        try {
            const updated = await bookingsApi.update(bookingId, updates);
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...updates } : b));
            return { success: true };
        } catch (error) {
            console.error('Update booking error:', error);
            return { success: false };
        }
    };

    // Cancel booking
    const cancelBooking = async (bookingId) => {
        return updateBooking(bookingId, { status: 'cancelled' });
    };

    // Toggle favorite
    const toggleFavorite = async (carId) => {
        if (!user?.id) return;

        try {
            const isFav = await favoritesApi.toggle(user.id, carId);

            if (isFav) {
                setFavorites(prev => [...prev, carId]);
            } else {
                setFavorites(prev => prev.filter(id => id !== carId));
            }
        } catch (error) {
            console.error('Toggle favorite error:', error);
        }
    };

    // Check if car is favorite
    const isFavorite = (carId) => {
        return favorites.includes(carId);
    };

    // Get favorite car IDs
    const getFavorites = () => {
        return favorites;
    };

    const value = {
        bookings,
        favorites,
        loading,
        createBooking,
        getUserBookings,
        getAllBookings,
        updateBooking,
        cancelBooking,
        toggleFavorite,
        isFavorite,
        getFavorites,
        refetch: fetchUserData,
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
