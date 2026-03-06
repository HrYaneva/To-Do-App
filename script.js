// Зареждане на задачите при стартиране
window.onload = loadTasks;

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") return;

    createTaskElement(taskText, false);
    saveTask(taskText, false);

    input.value = "";
}

function createTaskElement(taskText, completed) {
    const li = document.createElement("li");

    li.innerHTML = `
        <span class="task-text" onclick="toggleTask(this)">${taskText}</span>
        <span onclick="removeTask(this)">❌</span>
    `;

    if (completed) {
        li.classList.add("completed");
    }

    // Drag & Drop
    li.draggable = true;
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", dropTask);

    li.classList.add("added");
    setTimeout(() => li.classList.remove("added"), 300);

    document.getElementById("taskList").appendChild(li);
}

function toggleTask(element) {
    const li = element.parentElement;
    li.classList.toggle("completed");

    const taskText = element.textContent.trim();
    updateTaskStatus(taskText, li.classList.contains("completed"));
}

function removeTask(element) {
    const li = element.parentElement;
    const taskText = li.querySelector(".task-text").textContent.trim();

    li.classList.add("removing");

    setTimeout(() => {
        deleteTask(taskText);
        li.remove();
    }, 300); // колкото е анимацията
}


// --- LocalStorage функции ---

function saveTask(task, completed) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: task, completed: completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed));
}

function updateTaskStatus(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(t => {
        if (t.text === taskText) {
            return { text: t.text, completed: completed };
        }
        return t;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function clearAllTasks() {
    localStorage.removeItem("tasks"); // изчистваме LocalStorage
    document.getElementById("taskList").innerHTML = ""; // изчистваме списъка
}
// --- Dark Mode ---

// Зареждаме темата при стартиране
window.onload = function() {
    loadTasks();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeToggle").textContent = "Light Mode";
    }
};

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
let draggedItem = null;

function dragStart(e) {
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

// Запазваме новия ред в LocalStorage
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
