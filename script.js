const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const searchInput = document.getElementById("searchInput");
const calendarInput = document.getElementById("calendarInput");
const addSound = document.getElementById("addSound");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = { status: "all", category: "all", priority: "all", date: null };

renderTasks();
loadTheme();
loadDarkMode();

/* Добавяне на задача */
function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const date = dateInput.value || null;
    const time = timeInput.value || null;

    if (!text) return;

    const task = {
        id: Date.now(),
        text,
        category,
        priority,
        completed: false,
        reminderDate: date,
        reminderTime: time
    };

    tasks.push(task);
    saveTasks();
    clearInputs();
    renderTasks();

    if (addSound) {
        addSound.currentTime = 0;
        addSound.play().catch(() => {});
    }
}

/* Изчистване на всички задачи */
function clearAllTasks() {
    tasks = [];
    saveTasks();
    renderTasks();
}

/* Рендериране по категории */
function renderTasks() {
    const lists = {
        work: document.getElementById("taskList-work"),
        home: document.getElementById("taskList-home"),
        school: document.getElementById("taskList-school"),
        personal: document.getElementById("taskList-personal")
    };

    Object.values(lists).forEach(ul => ul.innerHTML = "");

    let filtered = tasks.filter(applyFilters);

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("added");
        li.dataset.id = task.id;
        li.draggable = true;

        li.addEventListener("dragstart", onDragStart);
        li.addEventListener("dragover", e => e.preventDefault());
        li.addEventListener("drop", onDrop);

        const main = document.createElement("div");
        main.className = "task-main";

        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = task.text;
        if (task.completed) textSpan.style.textDecoration = "line-through";

        const meta = document.createElement("div");
        meta.className = "task-meta";

        const prioSpan = document.createElement("span");
        prioSpan.className = "priority-icon";
        prioSpan.textContent = getPriorityIcon(task.priority) + " ";

        const catSpan = document.createElement("span");
        catSpan.className = "tag " + task.category;
        catSpan.textContent = getCategoryName(task.category);

        const remSpan = document.createElement("span");
        if (task.reminderDate) {
            remSpan.textContent = ` ⏰ ${task.reminderDate}${task.reminderTime ? " " + task.reminderTime : ""}`;
        }

        meta.appendChild(prioSpan);
        meta.appendChild(catSpan);
        if (task.reminderDate) meta.appendChild(remSpan);

        main.appendChild(textSpan);
        main.appendChild(meta);

        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.gap = "6px";
        actions.style.alignItems = "center";

        const toggleBtn = document.createElement("button");
        toggleBtn.className = "icon-btn";
        toggleBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        toggleBtn.onclick = () => toggleTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "icon-btn";
        deleteBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.appendChild(toggleBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(main);
        li.appendChild(actions);

        lists[task.category].appendChild(li);
    });
}

/* Филтри */
function applyFilters(task) {
    if (currentFilter.status === "completed" && !task.completed) return false;
    if (currentFilter.status === "active" && task.completed) return false;
    if (currentFilter.category !== "all" && task.category !== currentFilter.category) return false;
    if (currentFilter.priority !== "all" && task.priority !== currentFilter.priority) return false;
    if (currentFilter.date && task.reminderDate !== currentFilter.date) return false;

    const q = searchInput.value.toLowerCase();
    if (q && !task.text.toLowerCase().includes(q)) return false;

    return true;
}

function filterTasks(type) {
    currentFilter.status = type;
    renderTasks();
}

function filterByCategory(cat) {
    currentFilter.category = cat;
    renderTasks();
}

function filterByPriority(prio) {
    currentFilter.priority = prio;
    renderTasks();
}

function filterByDate(date) {
    currentFilter.date = date || null;
    renderTasks();
}

function searchTasks() {
    renderTasks();
}

/* Приоритет и категория */
function getPriorityIcon(p) {
    if (p === "high") return "🔥";
    if (p === "medium") return "⭐";
    return "🕓";
}

function getCategoryName(cat) {
    return {
        work: "Работа",
        home: "Дом",
        school: "Училище",
        personal: "Лични"
    }[cat];
}

/* Маркиране като готова */
function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
}

/* Изтриване с анимация */
function deleteTask(id) {
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (!li) return;
    li.classList.add("removed");
    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }, 280);
}

/* Drag & Drop */
let draggedId = null;

function onDragStart(e) {
    draggedId = e.currentTarget.dataset.id;
    e.dataTransfer.effectAllowed = "move";
}

function onDrop(e) {
    e.preventDefault();
    const targetId = e.currentTarget.dataset.id;
    if (!draggedId || draggedId === targetId) return;

    const fromIndex = tasks.findIndex(t => t.id == draggedId);
    const toIndex = tasks.findIndex(t => t.id == targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, moved);

    saveTasks();
    renderTasks();
}

/* Теми */
function changeTheme(theme) {
    document.body.classList.remove("theme-sunset","theme-ocean","theme-forest","theme-neon","theme-glassblack");
    if (theme === "sunset") document.body.classList.add("theme-sunset");
    if (theme === "ocean") document.body.classList.add("theme-ocean");
    if (theme === "forest") document.body.classList.add("theme-forest");
    if (theme === "neon") document.body.classList.add("theme-neon");
    if (theme === "glassblack") document.body.classList.add("theme-glassblack");
    localStorage.setItem("themeName", theme);
}

function loadTheme() {
    const saved = localStorage.getItem("themeName") || "default";
    const select = document.getElementById("themeSelect");
    if (select) select.value = saved;
    changeTheme(saved);
}

/* Dark mode */
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function loadDarkMode() {
    const saved = localStorage.getItem("darkMode") === "true";
    if (saved) document.body.classList.add("dark");
}

/* Helpers */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearInputs() {
    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
}
