document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript is running');

    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                console.log('Notification permission denied.');
            }
        });
    }

    const quotes = [
        "✨ You are amazing and capable of great things! ✨",
        "🌟 Keep going! You're doing great! 🌟",
        "💪 Believe in yourself and all that you are! 💪",
        "🌼 Stay positive, work hard, and make it happen! 🌼",
        "🌈 Your only limit is your mind. Keep pushing! 🌈",
        "🌸 Success is not the key to happiness. Happiness is the key to success! 🌸",
        "🎯 You’ve got this! Keep chasing your dreams! 🎯",
    ];

    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    function showNotification(task) {
        if (Notification.permission === 'granted') {
            new Notification('🌸 Task Reminder 🌸', {
                body: `✨ Don't forget to: ${task} ✨\n\n"${getRandomQuote()}"`,
                icon: 'https://i.imgur.com/4sKQwBQ.png'
            });
        }
    }

    function setTaskReminder(task, hours, minutes) {
        const reminderTime = (hours * 3600 + minutes * 60) * 1000;
        setTimeout(() => {
            showNotification(task);
        }, reminderTime);
    }

    document.getElementById('add-task').addEventListener('click', () => {
        console.log('Add Task button clicked');

        const taskInput = document.getElementById('task-input');
        const descriptionInput = document.getElementById('task-description-input');
        const hoursInput = document.getElementById('reminder-hours');
        const minutesInput = document.getElementById('reminder-minutes');
        const taskImageInput = document.getElementById('task-image');

        const taskValue = taskInput.value.trim();
        const taskDescription = descriptionInput.value.trim();
        const reminderHours = parseInt(hoursInput.value, 10) || 0;
        const reminderMinutes = parseInt(minutesInput.value, 10) || 0;
        const imageFile = taskImageInput.files[0];

        console.log('Task Value:', taskValue);
        console.log('Description:', taskDescription);
        console.log('Reminder Hours:', reminderHours);
        console.log('Reminder Minutes:', reminderMinutes);
        console.log('Image File:', imageFile);

        if (taskValue) {
            const taskList = document.getElementById('task-list');
            const newTask = document.createElement('li');
            newTask.classList.add('task-item');

            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');

            const taskText = document.createElement('span');
            taskText.classList.add('task-text');
            taskText.textContent = taskValue;

            taskContent.appendChild(checkbox);
            taskContent.appendChild(taskText);
            newTask.appendChild(taskContent);

            if (taskDescription) {
                const taskDescriptionElem = document.createElement('div');
                taskDescriptionElem.classList.add('task-description');
                taskDescriptionElem.textContent = taskDescription;
                newTask.appendChild(taskDescriptionElem);
            }

            if (imageFile) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(imageFile);
                img.classList.add('task-image');
                newTask.appendChild(img);
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => {
                newTask.classList.add('fade-out');
                setTimeout(() => taskList.removeChild(newTask), 300);
            });
            newTask.appendChild(deleteButton);

            taskList.appendChild(newTask);
            taskInput.value = '';
            descriptionInput.value = '';
            hoursInput.value = '';
            minutesInput.value = '';
            taskImageInput.value = '';

            setTaskReminder(taskValue, reminderHours, reminderMinutes);
        } else {
            console.log('Please enter a task.');
        }
    });

    document.getElementById('task-list').addEventListener('change', (event) => {
        if (event.target.classList.contains('task-checkbox')) {
            const taskItem = event.target.closest('.task-item');
            const taskText = taskItem.querySelector('.task-text');
            if (event.target.checked) {
                taskText.classList.add('completed-task');
            } else {
                taskText.classList.remove('completed-task');
            }
        }
    });
});