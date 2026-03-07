// ===============================
// 🧊 ИНИЦИАЛИЗАЦИЯ
// ===============================
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const addSound = document.getElementById("addSound");

// Зареждане на задачите от LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();
loadTheme();

// ===============================
// 🧊 ДОБАВЯНЕ НА ЗАДАЧА
// ===============================
function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;

    if (text === "") return;

    const task = {
        id: Date.now(),
        text,
        category,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";

    if (addSound) {
        addSound.currentTime = 0;
        addSound.play().catch(() => {});
    }
}

// ===============================
// 🧊 ИЗЧИСТВАНЕ НА ВСИЧКИ ЗАДАЧИ
// ===============================
function clearAllTasks() {
    tasks = [];
    saveTasks();
    renderTasks();
}

// ===============================
// 🧊 РЕНДЕРИРАНЕ НА ЗАДАЧИТЕ
// ===============================
function renderTasks(filtered = tasks) {
    taskList.innerHTML = "";

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("added");
        li.dataset.id = task.id;

        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div style="display:flex; gap:10px; align-items:center;">
                <span class="tag ${task.category}">${getCategoryName(task.category)}</span>

                <button class="icon-btn" onclick="toggleTask(${task.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <button class="icon-btn" onclick="deleteTask(${task.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M6 18L18 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// ===============================
// 🧊 ПОЛУЧАВАНЕ НА ИМЕ НА КАТЕГОРИЯ
// ===============================
function getCategoryName(cat) {
    return {
        work: "Работа",
        home: "Дом",
        school: "Училище",
        personal: "Лични"
    }[cat];
}

// ===============================
// 🧊 МАРКИРАНЕ КАТО ГОТОВА
// ===============================
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );

    saveTasks();
    renderTasks();
}

// ===============================
// 🧊 ИЗТРИВАНЕ НА ЗАДАЧА С АНИМАЦИЯ
// ===============================
function deleteTask(id) {
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (!li) return;

    li.classList.add("removed");

    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }, 280);
}

// ===============================
// 🧊 ТЪРСЕНЕ
// ===============================
function searchTasks() {
    const query = searchInput.value.toLowerCase();

    const filtered = tasks.filter(task =>
        task.text.toLowerCase().includes(query)
    );

    renderTasks(filtered);
}

// ===============================
// 🧊 ФИЛТРИ: ВСИЧКИ / ГОТОВИ / НЕГОТОВИ
// ===============================
function filterTasks(type) {
    let filtered = tasks;

    if (type === "completed") {
        filtered = tasks.filter(t => t.completed);
    } else if (type === "active") {
        filtered = tasks.filter(t => !t.completed);
    }

    renderTasks(filtered);
}

// ===============================
// 🧊 ФИЛТРИ ПО КАТЕГОРИЯ
// ===============================
function filterByCategory(cat) {
    if (cat === "all") {
        renderTasks(tasks);
        return;
    }

    const filtered = tasks.filter(task => task.category === cat);
    renderTasks(filtered);
}

// ===============================
// 🧊 DARK MODE
// ===============================
function toggleTheme() {
    document.body.classList.toggle("dark");
    saveTheme();
}

function saveTheme() {
    localStorage.setItem("theme", document.body.classList.contains("dark"));
}

function loadTheme() {
    const saved = localStorage.getItem("theme") === "true";
    if (saved) document.body.classList.add("dark");
}

// ===============================
// 🧊 ЗАПАЗВАНЕ В LOCALSTORAGE
// ===============================
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
