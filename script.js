const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const startTimerBtn = document.getElementById('startTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const timerDisplay = document.getElementById('timerDisplay');

let timerInterval = null;
let timeLeft = 1500;

document.addEventListener('DOMContentLoaded', loadTasks);

function addTask(event) {
    if (event) event.preventDefault();

    const taskText = taskInput.value.trim();
    const priorityValue = prioritySelect.value;

    if (taskText === "") {
        alert("Please type a task first!");
        return;
    }

    createTaskElement(taskText, priorityValue, false);
    sortListHTML();
    saveTasks();
    updateCounter();
    taskInput.value = "";
}

function createTaskElement(text, priority, isCompleted) {
    const li = document.createElement('li');
    li.classList.add(priority);

    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    textSpan.style.flex = "1";
    
    if (isCompleted) {
        textSpan.classList.add('completed');
    }
    
    textSpan.addEventListener('click', function() {
        textSpan.classList.toggle('completed');
        saveTasks();
        updateCounter();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('delete-btn');
    
    deleteBtn.addEventListener('click', function() {
        li.remove();
        saveTasks();
        updateCounter();
    });

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function sortListHTML() {
    const listItems = Array.from(taskList.querySelectorAll('li'));
    const priorityWeights = { 'high': 3, 'medium': 2, 'low': 1 };

    listItems.sort((a, b) => {
        let classA = 'low';
        if (a.classList.contains('high')) classA = 'high';
        else if (a.classList.contains('medium')) classA = 'medium';

        let classB = 'low';
        if (b.classList.contains('high')) classB = 'high';
        else if (b.classList.contains('medium')) classB = 'medium';

        const weightA = priorityWeights[classA] || 0;
        const weightB = priorityWeights[classB] || 0;
        return weightB - weightA;
    });

    taskList.innerHTML = "";
    listItems.forEach(li => taskList.appendChild(li));
}

function saveTasks() {
    const tasks = [];
    const listItems = taskList.querySelectorAll('li');

    listItems.forEach(li => {
        const textSpan = li.querySelector('span');
        
        let savedPriority = 'low';
        if (li.classList.contains('high')) savedPriority = 'high';
        else if (li.classList.contains('medium')) savedPriority = 'medium';

        tasks.push({
            text: textSpan.textContent,
            priority: savedPriority,
            completed: textSpan.classList.contains('completed')
        });
    });

    localStorage.setItem('myTodoList', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('myTodoList');
    
    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        tasks.forEach(task => {
            createTaskElement(task.text, task.priority, task.completed);
        });
        sortListHTML();
    }
    updateCounter();
}

function updateCounter() {
    const total = taskList.querySelectorAll('li').length;
    const completed = taskList.querySelectorAll('.completed').length;
    const active = total - completed;
    const counterEl = document.getElementById('counter');
    
    if (!counterEl) return;
    
    if (active > 0){
        counterEl.textContent = active === 1 ? "1 task remaining" : `${active} tasks remaining`;
    } 
    else if (total > 0 && active === 0) { 
        counterEl.textContent = "Yayy, you're all done! Great job! 🎉";
    } 
    else if (total === 0){
        counterEl.textContent = "Your task list is empty! 🎉"
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}

function toggleTimer() {
    if (timerInterval === null) {
        startTimerBtn.textContent = "Pause";
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                startTimerBtn.textContent = "Start";
                const alarm = document.getElementById('alarmSound');
                if(alarm) alarm.play();
                alert("Pomodoro session completed! Time to take a break! 🌸");
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        startTimerBtn.textContent = "Start";
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 1500;
    updateTimerDisplay();
    startTimerBtn.textContent = "Start";
}

function switchEmbed(videoId, clickedButton) {
    const embed = document.getElementById('musicEmbed');
    
    embed.src = `https://youtube.com/embed/${videoId}?enablejsapi=1&loop=1&playlist=${videoId}&autoplay=1`;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });  
    clickedButton.classList.add('active');
}



todoForm.addEventListener('submit', addTask);
startTimerBtn.addEventListener('click', toggleTimer);
resetTimerBtn.addEventListener('click', resetTimer);
