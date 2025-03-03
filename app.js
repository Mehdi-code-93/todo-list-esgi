(function() {
    const auth = {
        isLoggedIn: () => localStorage.getItem('user') !== null,
        register: (username, password) => {
            localStorage.setItem('user', username);
            return true;
        },
        login: (username, password) => {
            const user = localStorage.getItem('user');
            return user === username;
        },
        logout: () => {
            localStorage.removeItem('user');
        }
    };

    const tasks = {
        getAll: () => {
            const taskData = localStorage.getItem('tasks');
            return taskData ? JSON.parse(taskData) : [];
        },
        create: (title, description, deadline) => {
            const taskList = tasks.getAll();
            const newTask = { id: Date.now(), title, description, deadline, completed: false };
            taskList.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(taskList));
            return true;
        },
        complete: (taskId) => {
            const taskList = tasks.getAll();
            const taskIndex = taskList.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                taskList[taskIndex].completed = true;
                localStorage.setItem('tasks', JSON.stringify(taskList));
                return true;
            }
            return false;
        },
        delete: (taskId) => {
            const taskList = tasks.getAll();
            const taskIndex = taskList.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                taskList.splice(taskIndex, 1);
                localStorage.setItem('tasks', JSON.stringify(taskList));
                return true;
            }
            return false;
        },
        search: (query) => {
            const taskList = tasks.getAll();
            return taskList.filter(task => task.title.toLowerCase().includes(query.toLowerCase()));
        }
    };
    


    // Éléments du DOM
    const authContainer = document.getElementById('auth-container');
    const todoContainer = document.getElementById('todo-container');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const addTaskForm = document.getElementById('add-task-form');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');

    // afficher les tâches
    function displayTasks(tasksToDisplay) {
        taskList.innerHTML = '';
        tasksToDisplay.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Date limite: ${task.deadline}</p>
                <div class="task-actions">
                    ${!task.completed ? `<button class="complete-btn" data-id="${task.id}">Valider</button>` : ''}
                    ${!task.completed ? `<button class="delete-btn" data-id="${task.id}">Supprimer</button>` : ''}
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    // mettre à jour l'interface
    function updateUI() {
        if (auth.isLoggedIn()) {
            authContainer.style.display = 'none';
            todoContainer.style.display = 'block';
            displayTasks(tasks.getAll());
        } else {
            authContainer.style.display = 'block';
            todoContainer.style.display = 'none';
        }
    }

    // inscription
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        if (username && password) {
            if (auth.register(username, password)) {
                alert("Inscription réussie. Veuillez vous connecter.");
                registerForm.reset();
            }
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    });

    // connexion
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        if (username && password) {
            if (auth.login(username, password)) {
                updateUI();
                loginForm.reset();
            } else {
                alert("Nom d'utilisateur ou mot de passe incorrect.");
            }
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    });

    // ajout de tâche
    addTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const deadline = document.getElementById('task-deadline').value;
        if (title && description && deadline) {
            if (tasks.create(title, description, deadline)) {
                updateUI();
                addTaskForm.reset();
            }
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    });

    // validation et suppression des tâches
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('complete-btn')) {
            const taskId = parseInt(e.target.getAttribute('data-id'));
            if (tasks.complete(taskId)) {
                updateUI();
            }
        } else if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.getAttribute('data-id'));
            if (tasks.delete(taskId)) {
                updateUI();
            }
        }
    });

    // echerche de tâches
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;
        const searchResults = tasks.search(query);
        displayTasks(searchResults);
    });

    updateUI();
})();