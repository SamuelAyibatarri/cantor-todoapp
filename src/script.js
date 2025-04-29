window.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("database")) {
        const obj = {tasks: []};
        localStorage.setItem("database", JSON.stringify(obj))
    }
    tasks_obj = JSON.parse(localStorage.getItem("database"))
    loadExistingTasks();
    makeAllVisible();
})

let tasks_obj;
const add_task_btn = document.querySelector(".add-icon");
const tasks_div_all = document.querySelector(".all");
const tasks_div_unfinished = document.querySelector(".unfinished");
const tasks_div_finished = document.querySelector(".finished");
const checkbox_btn = document.querySelector(".task-checkbox");
const all_btn = document.getElementById("all-btn");
const unfinished_btn = document.getElementById("unfinished-btn");
const finished_btn = document.getElementById("finished-btn");


/*async function sha256(message) {
    try {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        return hashHex;
    } catch (error) {
        throw new Error("Hashing failed");
    }
}*/
// Task Entry class to initiate a task
class TaskEntry {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    createTask() {
        return { name: this.name, id: this.id, status: "unchecked" };
    }
}

// Function to add a new task
function addNewTask(name) {
    // Check if the name input is a valid input
    let message = "";
    if(name == null || name == undefined || name == "") {
        message = "Enter a valid task name!"
        alert(message);
        return;
    }
    // Check if a task with the same name already exists
    for (let i = 0; i < tasks_obj.tasks.length; i++) {
        if (tasks_obj.tasks[i].name === name) {
            message = `Task "${name}" already exists`;
            alert(message);
            return;
        }
    }
    let task = new TaskEntry(name, generateUniqueId());
    tasks_obj.tasks.push(task.createTask());
    localStorage.setItem("database", JSON.stringify(tasks_obj));
    message = `Task "${name}" successfully added;`;
    alert(message);
    loadExistingTasks();
}

// Function to mark a task as complete
function markTask(name) {
    let message = "";
    const task = tasks_obj.tasks.find(task => task.name === name);
    if (!task) {
        message = `Task "${name}" not found.`;
        alert(message); 
        return;
    }
    if (task.status === "checked") {
        message = `Task "${name}" is already marked as complete.`;
        alert(message);
        return;
    }
    task.status = "checked";
    localStorage.setItem("database", JSON.stringify(tasks_obj));
    message = `Task "${name}" has been successfully marked as complete!`;
    alert(message);
    loadExistingTasks();
}

function unmarkTask(name) {
    let message = "";
    const task = tasks_obj.tasks.find(task => task.name === name);
    if (!task) {
        message = `Task "${name}" not found.`;
        alert(message); 
        return;
    }
    if (task.status === "unchecked") {
        return;
    }
    task.status = "unchecked";
    localStorage.setItem("database", JSON.stringify(tasks_obj));
    message = `Task "${name}" has been successfully marked as incomplete!`;
    alert(message);
    loadExistingTasks();
}

// Function to delete a task
function deleteTask(name) {
    const initialLength = tasks_obj.tasks.length;

    // Filter out the task with the matching name
    tasks_obj.tasks = tasks_obj.tasks.filter(task => task.name !== name);

    // Check if anything was removed
    if (tasks_obj.tasks.length === initialLength) {
        message = `Task "${name}" doesn't exist.`;
        alert(message);
        return;
    }

    localStorage.setItem("database", JSON.stringify(tasks_obj));
    loadExistingTasks();
}

// Function to add existing tasks
function loadExistingTasks() {
    const database = JSON.parse(localStorage.getItem("database"));
    
    if (!database || !database.tasks) {
        console.log("No tasks found.");
        return;
    }

    const tasks_all = database.tasks;
    const tasks_unchecked = database.tasks.filter(x => x.status === "unchecked");
    const tasks_checked = database.tasks.filter(x => x.status === "checked");

    tasks_div_all.innerHTML = ""; // Clear old tasks in class "all"
    if (tasks_all){
        loadTasks(tasks_all, tasks_div_all); // Load all tasks in the div with class "all"
    }

    tasks_div_unfinished.innerHTML = ""; // Clear old tasks in class "unfinished"
    if (tasks_unchecked){
        loadTasks(tasks_unchecked, tasks_div_unfinished); //Load all unfinished tasks in the div with class "unfinished"
    }

    tasks_div_finished.innerHTML = ""; // Clear old tasks in class "finished"
    if (tasks_checked){
        loadTasks(tasks_checked, tasks_div_finished); //Load all finished tasks in the div with class "finished"
    }
}

// Miniature functions to load the tasks
function loadTasks(arg, arg2) {
    arg.forEach(task => {
        arg2.innerHTML += createTaskHTML(task.name, task.id, task.status);
    })
}

// Function to generate a unique ID for each task
function generateUniqueId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1e6);
    return `ID-${timestamp}-${random}`;
}

function createTaskHTML(name, id, status) {
    return `
        <div class="task" id="${id}">
            <div>
                <input type="checkbox" class="task-checkbox" ${status} onclick="toggleCheck(this, '${name}')">
                <span class="task-name">${name}</span>
            </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="trash-icon" onclick="deleteTask('${name}')">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
        </div>
    `;
}

function toggleCheck(checkbox, name) {
    if (checkbox.checked) {
        markTask(name);
    } else {
        unmarkTask(name);
    }
}

function makeAllVisible() {
    tasks_div_all.style.display = "flex";
    tasks_div_finished.style.display = "none";
    tasks_div_unfinished.style.display = "none";

    all_btn.style.backgroundColor = "black";
    all_btn.style.color = "white";

    unfinished_btn.style.backgroundColor = "#e5e5e5";
    unfinished_btn.style.color = "black";

    finished_btn.style.backgroundColor = "#e5e5e5";
    finished_btn.style.color = "black";
};

function makeUnfinishedVisible() {
    tasks_div_all.style.display = "none";
    tasks_div_finished.style.display = "none";
    tasks_div_unfinished.style.display = "flex";

    unfinished_btn.style.backgroundColor = "black";
    unfinished_btn.style.color = "white";

    all_btn.style.backgroundColor = "#e5e5e5";
    all_btn.style.color = "black";

    finished_btn.style.backgroundColor = "#e5e5e5";
    finished_btn.style.color = "black";
};

function makeFinishedVisible() {
    tasks_div_all.style.display = "none";
    tasks_div_finished.style.display = "flex";
    tasks_div_unfinished.style.display = "none";

    finished_btn.style.backgroundColor = "black";
    finished_btn.style.color = "white";

    all_btn.style.backgroundColor = "#e5e5e5";
    all_btn.style.color = "black";

    unfinished_btn.style.backgroundColor = "#e5e5e5";
    unfinished_btn.style.color = "black";
}



// Some debugging functions
function logTasksData() {
    console.log(tasks_obj)
    console.log(tasks_obj.tasks);
}

function test(x) {
    let result = `this is just a simple "${x}"`;
    return result;
}

add_task_btn.addEventListener("click", () => {
    addNewTask(prompt("Enter the name of your task: "));
});

checkbox_btn.addEventListener("click", () => {
    const arg = checkbox_btn.previousElementSibling.textContent;
    markTask(arg);
})
