const auth = {
    isLoggedIn: () => {
        return true;
    },
    currentUser: 'user123'
};

const storage = {
    get: (key) => {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
    },
    save: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }
};


// Gestion des tâches
const tasks = {
    // Créer une nouvelle tâche
    create: function(title, description, deadline) {
        if (!auth.isLoggedIn()) return false;
        
        const userTasks = storage.get(`tasks_${auth.currentUser}`) || [];
        const newTask = {
            id: Date.now(),
            title,
            description,
            deadline,
            completed: false,
            createdAt: new Date().toISOString()
        };
        userTasks.push(newTask);
        storage.save(`tasks_${auth.currentUser}`, userTasks);
        return true;
    },

    // Récupérer toutes les tâches de l'utilisateur connecté
    getAll: function() {
        if (!auth.isLoggedIn()) return [];
        return storage.get(`tasks_${auth.currentUser}`) || [];
    },

    // Valider une tâche
    complete: function(taskId) {
        if (!auth.isLoggedIn()) return false;
        
        const userTasks = this.getAll();
        const taskIndex = userTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            userTasks[taskIndex].completed = true;
            storage.save(`tasks_${auth.currentUser}`, userTasks);
            return true;
        }
        return false;
    },

    // Supprimer une tâche
    delete: function(taskId) {
        if (!auth.isLoggedIn()) return false;
        
        const userTasks = this.getAll();
        const taskIndex = userTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1 && !userTasks[taskIndex].completed) {
            userTasks.splice(taskIndex, 1);
            storage.save(`tasks_${auth.currentUser}`, userTasks);
            return true;
        }
        return false;
    },

    // Rechercher des tâches
    search: function(query) {
        if (!auth.isLoggedIn()) return [];
        
        const userTasks = this.getAll();
        return userTasks.filter(task => 
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        );
    }
};