// Зареждане на задачите при стартиране
window.onload = loadTasks;

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") return;

    createTaskElement(taskText);
    saveTask(taskText);

    input.value = "";
}

function createTaskElement(taskText) {
    const li = document.createElement("li");
    li.innerHTML = `
        ${taskText}
        <span onclick="removeTask(this)">❌</span>
    `;
    document.getElementById("taskList").appendChild(li);
}

function removeTask(element) {
    const taskText = element.parentElement.textContent.replace("❌", "").trim();
    deleteTask(taskText);
    element.parentElement.remove();
}

// --- LocalStorage функции ---

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task));
}

function deleteTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
