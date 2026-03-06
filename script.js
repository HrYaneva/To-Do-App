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

    document.getElementById("taskList").appendChild(li);
}

function toggleTask(element) {
    const li = element.parentElement;
    li.classList.toggle("completed");

    const taskText = element.textContent.trim();
    updateTaskStatus(taskText, li.classList.contains("completed"));
}

function removeTask(element) {
    const taskText = element.parentElement.querySelector(".task-text").textContent.trim();
    deleteTask(taskText);
    element.parentElement.remove();
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
