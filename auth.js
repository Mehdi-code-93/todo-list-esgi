const auth = {
    currentUser: null,

    // Inscription
    register: function(username, password) {
        const users = storage.get('users') || [];
        if (users.find(u => u.username === username)) {
            alert("Ce nom d'utilisateur existe déjà.");
            return false;
        }
        users.push({ username, password });
        storage.save('users', users);
        return true;
    },

    // Connexion
    login: function(username, password) {
        const users = storage.get('users') || [];
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = username;
            return true;
        }
        return false;
    },

    // Déconnexion
    logout: function() {
        this.currentUser = null;
    },

    isLoggedIn: function() {
        return this.currentUser !== null;
    }
};

const storage = {
    get: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Error getting item from storage:", error);
            return null;
        }
    },
    save: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving item to storage:", error);
        }
    }
};