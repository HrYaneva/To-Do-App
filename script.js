// Зареждане на задачите и темата при стартиране
window.onload = function () {
    loadTasks();

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeToggle").textContent = "Light Mode";
    }
};

// Добавяне на задача
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    const category = document.getElementById("categorySelect").value;

    if (taskText === "") return;

    createTaskElement(taskText, false, category);
    saveTask(taskText, false, category);

    input.value = "";
}


// Създаване на HTML елемент за задача
function createTaskElement(taskText, completed, category) {
    const li = document.createElement("li");

    li.innerHTML = `
        <span class="task-text" onclick="toggleTask(this)">${taskText}</span>
        <span class="tag ${category}">${getCategoryName(category)}</span>
        <span onclick="removeTask(this)">❌</span>
    `;


    if (completed) li.classList.add("completed");

    // Drag & Drop
    li.draggable = true;
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", dropTask);

    // Анимация при добавяне
    li.classList.add("added");
    setTimeout(() => li.classList.remove("added"), 300);

    document.getElementById("taskList").appendChild(li);
}

// Маркиране като готово
function toggleTask(element) {
    const li = element.parentElement;
    li.classList.toggle("completed");

    const taskText = element.textContent.trim();
    updateTaskStatus(taskText, li.classList.contains("completed"));
}

// Премахване на задача
function removeTask(element) {
    const li = element.parentElement;
    const taskText = li.querySelector(".task-text").textContent.trim();

    li.classList.add("removing");

    setTimeout(() => {
        deleteTask(taskText);
        li.remove();
    }, 300);
}

// LocalStorage функции
function saveTask(task, completed, category) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: task, completed, category });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed, task.category));
}

function updateTaskStatus(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(t => t.text === taskText ? { text: t.text, completed } : t);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAllTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
}

// Dark Mode
function toggleTheme() {
    const body = document.body;
    const button = document.getElementById("themeToggle");

    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        button.textContent = "Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        button.textContent = "Dark Mode";
    }
}

// Drag & Drop
let draggedItem = null;

function dragStart() {
    draggedItem = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dropTask(e) {
    e.preventDefault();
    const list = document.getElementById("taskList");

    if (draggedItem !== this) {
        let items = Array.from(list.children);
        let draggedIndex = items.indexOf(draggedItem);
        let targetIndex = items.indexOf(this);

        if (draggedIndex < targetIndex) {
            list.insertBefore(draggedItem, this.nextSibling);
        } else {
            list.insertBefore(draggedItem, this);
        }

        saveOrder();
    }
}

function saveOrder() {
    let items = document.querySelectorAll("#taskList li");
    let tasks = [];

    items.forEach(li => {
        let text = li.querySelector(".task-text").textContent.trim();
        let completed = li.classList.contains("completed");
        tasks.push({ text, completed });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Филтриране
function filterTasks(type) {
    const items = document.querySelectorAll("#taskList li");

    items.forEach(li => {
        const isCompleted = li.classList.contains("completed");

        if (type === "all") li.style.display = "flex";
        else if (type === "completed" && isCompleted) li.style.display = "flex";
        else if (type === "active" && !isCompleted) li.style.display = "flex";
        else li.style.display = "none";
    });
}

// Търсене
function searchTasks() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const items = document.querySelectorAll("#taskList li");

    items.forEach(li => {
        const text = li.querySelector(".task-text").textContent.toLowerCase();
        li.style.display = text.includes(query) ? "flex" : "none";
    });
}
function filterByCategory(category) {
    const items = document.querySelectorAll("#taskList li");

    items.forEach(li => {
        const tag = li.querySelector(".tag");
        const taskCategory = tag ? tag.classList[1] : null;

        if (category === "all") {
            li.style.display = "flex";
        } else if (taskCategory === category) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}
function getCategoryName(cat) {
    switch(cat) {
        case "work": return "Работа";
        case "home": return "Дом";
        case "school": return "Училище";
        case "personal": return "Лични";
        default: return "";
    }
}
