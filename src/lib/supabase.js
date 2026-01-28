import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rpqmgnfqsauaugufynkg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwcW1nbmZxc2F1YXVndWZ5bmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDYwNzQsImV4cCI6MjA4NTE4MjA3NH0.o91ted2wCBFNj1Ct1mjhOfzL2nTYlnj-36hGb0Yuxqw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations

// =================== USERS ===================
export const usersApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async create(user) {
        const { data, error } = await supabase
            .from('users')
            .insert([{ ...user, created_at: new Date().toISOString() }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('users')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};

// =================== CARS ===================
export const carsApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getFeatured() {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('featured', true)
            .eq('available', true)
            .limit(6);
        if (error) throw error;
        return data;
    },

    async create(car) {
        const { data, error } = await supabase
            .from('cars')
            .insert([{ ...car, created_at: new Date().toISOString() }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('cars')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async uploadImage(file, carId) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${carId}-${Date.now()}.${fileExt}`;
        const filePath = `cars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};

// =================== BOOKINGS ===================
export const bookingsApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        user:users(id, name, email, phone),
        car:cars(id, name, brand, images, price_per_day)
      `)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getByUserId(userId) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        car:cars(id, name, brand, images, price_per_day)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        user:users(id, name, email, phone),
        car:cars(*)
      `)
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async create(booking) {
        const { data, error } = await supabase
            .from('bookings')
            .insert([{ ...booking, created_at: new Date().toISOString() }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('bookings')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async getStats() {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('status, total_price');

        if (error) throw error;

        const stats = {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'pending').length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            completed: bookings.filter(b => b.status === 'completed').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
            revenue: bookings
                .filter(b => b.status !== 'cancelled')
                .reduce((sum, b) => sum + (b.total_price || 0), 0)
        };

        return stats;
    }
};

// =================== LOCATIONS ===================
export const locationsApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('locations')
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    },

    async create(location) {
        const { data, error } = await supabase
            .from('locations')
            .insert([location])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('locations')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('locations')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};

// =================== SETTINGS ===================
export const settingsApi = {
    async get() {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async update(settings) {
        // Upsert settings (insert or update)
        const { data, error } = await supabase
            .from('settings')
            .upsert([{ id: 1, ...settings, updated_at: new Date().toISOString() }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

// =================== FAVORITES ===================
export const favoritesApi = {
    async getByUserId(userId) {
        const { data, error } = await supabase
            .from('favorites')
            .select(`
        *,
        car:cars(*)
      `)
            .eq('user_id', userId);
        if (error) throw error;
        return data;
    },

    async toggle(userId, carId) {
        // Check if favorite exists
        const { data: existing } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('car_id', carId)
            .single();

        if (existing) {
            // Remove favorite
            await supabase
                .from('favorites')
                .delete()
                .eq('id', existing.id);
            return false;
        } else {
            // Add favorite
            await supabase
                .from('favorites')
                .insert([{ user_id: userId, car_id: carId }]);
            return true;
        }
    },

    async isFavorite(userId, carId) {
        const { data } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('car_id', carId)
            .single();
        return !!data;
    }
};

export default supabase;
