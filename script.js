// ==============================
// Contact Form Validation
// ==============================

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const message = document.getElementById("message").value.trim();

    const successMessage = document.getElementById("successMessage");

    if (name === "" || email === "" || message === "") {

        successMessage.style.color = "red";

        successMessage.textContent = "Please fill in all fields.";

        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        successMessage.style.color = "red";

        successMessage.textContent = "Please enter a valid email address.";

        return;
    }

    successMessage.style.color = "green";

    successMessage.textContent =
        "Thank you, " + name + "! Your message has been submitted.";

    contactForm.reset();

});


// ==============================
// Mobile Hamburger Menu
// ==============================

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function() {

    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuToggle.textContent = isOpen ? "✕" : "☰";

    menuToggle.setAttribute("aria-expanded", isOpen);

});


// Close Menu After Clicking Navigation Links

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", function() {

        navLinks.classList.remove("active");

        menuToggle.textContent = "☰";

        menuToggle.setAttribute("aria-expanded", "false");

    });

});

// ==============================
// TASK MANAGEMENT
// ==============================

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");

const pendingTasks = document.getElementById("pendingTasks");

const completedTasks = document.getElementById("completedTasks");

// Save Tasks

function saveTasks() {

    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));

}

// Add New Task

function addTask() {

    const taskName = taskInput.value.trim();

    if (taskName === "") {

        alert("Please enter a task!");

        return;

    }

    const newTask = {

        id: Date.now(),

        name: taskName,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

}

// Display Tasks

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });

    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            '<p class="empty-message">No tasks found.</p>';

    }

    filteredTasks.forEach(task => {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const details = document.createElement("div");

        details.className = "task-details";

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            toggleTask(task.id);

        });

        const taskName = document.createElement("span");

        taskName.className = "task-name";

        taskName.textContent = task.name;

        details.appendChild(checkbox);

        details.appendChild(taskName);

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });

        taskItem.appendChild(details);

        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);

    });

    updateStats();

}

// Complete / Pending Task

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();

}

// Delete Task

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

}

// Update Statistics

function updateStats() {

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;

}

// Filter Tasks

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter-btn").forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

// Add Button Click

addTaskBtn.addEventListener("click", addTask);

// Add Task Using Enter Key

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});

// Initial Display

renderTasks();