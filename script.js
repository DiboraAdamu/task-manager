// State management
let tasks = [];
let currentFilter = 'all'; // 'all', 'active', or 'done'

// DOM references
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const showAllBtn = document.getElementById('showAllBtn');
const showActiveBtn = document.getElementById('showActiveBtn');
const showDoneBtn = document.getElementById('showDoneBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const clearDoneBtn = document.getElementById('clearDoneBtn');

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [
            { id: 1, text: 'Learn JavaScript Arrays & Objects', completed: true },
            { id: 2, text: 'Build a Persistent Task Manager', completed: false }
        ];
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render function using filter() and map()
function render() {
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'done') return task.completed;
        return true;
    });

    const taskHtmlArray = filteredTasks.map(task => {
        return `
            <li class="${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <span>${escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button onclick="toggleTask(${task.id})">
                        ${task.completed ? 'Undo' : 'Done'}
                    </button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </li>
        `;
    });

    taskList.innerHTML = taskHtmlArray.join('');

    const activeCount = tasks.filter(task => !task.completed).length;
    const totalCount = tasks.length;
    counter.textContent = `${activeCount} active / ${totalCount} total`;

    saveTasks();
}

// Core Task Operations
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    render();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    render();
}

function clearDone() {
    tasks = tasks.filter(task => !task.completed);
    render();
}

// Security helper to escape input
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateActiveFilterButton(activeBtn) {
    [showAllBtn, showActiveBtn, showDoneBtn].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

showAllBtn.addEventListener('click', () => {
    currentFilter = 'all';
    updateActiveFilterButton(showAllBtn);
    render();
});

showActiveBtn.addEventListener('click', () => {
    currentFilter = 'active';
    updateActiveFilterButton(showActiveBtn);
    render();
});

showDoneBtn.addEventListener('click', () => {
    currentFilter = 'done';
    updateActiveFilterButton(showDoneBtn);
    render();
});

clearDoneBtn.addEventListener('click', clearDone);

// Initialize
loadTasks();
render();