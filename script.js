// ===============================
// 🧊 ИНИЦИАЛИЗАЦИЯ
// ===============================
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

// Зареждане на задачите от LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();


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

        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div style="display:flex; gap:10px; align-items:center;">
                <span class="tag ${task.category}">${getCategoryName(task.category)}</span>
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">✖</button>
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
// 🧊 ИЗТРИВАНЕ НА ЗАДАЧА
// ===============================
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
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

loadTheme();


// ===============================
// 🧊 ЗАПАЗВАНЕ В LOCALSTORAGE
// ===============================
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
