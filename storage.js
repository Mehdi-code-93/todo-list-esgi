// Gestion du stockage local
const storage = {
    // Sauvegarder les données
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Récupérer les données
    get: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // Supprimer les données
    remove: function(key) {
        localStorage.removeItem(key);
    }
};