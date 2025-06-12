export const Storage = {
    init() {
        if (!this.get('initialized')) {
            this.set('initialized', true);
            this.set('patients', []);
            this.set('queue', []);
            this.set('doctors', []);
        }
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    getKeys() {
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.error('Error getting localStorage keys:', error);
            return [];
        }
    },

    has(key) {
        return localStorage.getItem(key) !== null;
    },

    getSize() {
        try {
            let size = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    size += localStorage[key].length + key.length;
                }
            }
            return size;
        } catch (error) {
            console.error('Error calculating storage size:', error);
            return 0;
        }
    },

    exportData() {
        try {
            const data = {};
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    data[key] = this.get(key);
                }
            }
            return data;
        } catch (error) {
            console.error('Error exporting data:', error);
            return {};
        }
    },

    importData(data) {
        try {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    this.set(key, data[key]);
                }
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};
