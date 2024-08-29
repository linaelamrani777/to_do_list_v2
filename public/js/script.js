document.addEventListener('DOMContentLoaded', () => {

    const API_URL = `${window.location.protocol}//${window.location.host}`;

    console.log('JavaScript is running');
    const token = localStorage.getItem('token');

    if (!token) {
        console.log('You are not logged in!');
        window.location.href = '/auth.html';  // Redirect to login page
        return;
    }

    fetch(`${API_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (!data.valid) {
            console.log('Invalid token! Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/auth.html';  // Redirect to login page
        }
    })
    .catch(error => {
        console.error('Error verifying token:', error);
        console.log('An error occurred while verifying your session.');
        window.location.href = '/auth.html';  // Redirect to login page
    });

    function logout() {
        localStorage.removeItem('token');
        window.location.href = '/auth.html';
    }
    
    document.getElementById('logoutButton').addEventListener('click', logout);

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

    function deleteTask(id) {
        fetch(`${API_URL}/api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        }).catch(e => {
            console.log(e);
        })

    }

    function generate_list(task) {
        const taskList = document.getElementById('task-list');
        const newTask = document.createElement('li');
        newTask.classList.add('task-item');

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.dataset.id = task._id


        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.name;
        if (task.completed) {
            taskText.classList.add('completed-task');
            checkbox.checked = true
        }

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);
        newTask.appendChild(taskContent);

        if (task.description) {
            const taskDescriptionElem = document.createElement('div');
            taskDescriptionElem.classList.add('task-description');
            taskDescriptionElem.textContent = task.description;
            newTask.appendChild(taskDescriptionElem);
        }

        if (task.imageUrl) {
            const img = document.createElement('img');
            img.src = task.imageUrl;
            img.classList.add('task-image');
            newTask.appendChild(img);
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteTask(task._id)
            newTask.classList.add('fade-out');
            setTimeout(() => taskList.removeChild(newTask), 300);
        });
        newTask.appendChild(deleteButton);

        taskList.appendChild(newTask);
        setTaskReminder(task.name, task.reminder.hours, task.reminder.minutes);
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
        const file = taskImageInput.files[0];
        let imageUrl = ""
        if (file) {
            imageUrl = URL.createObjectURL(file);
        }

        console.log('Task Value:', taskValue);
        console.log('Description:', taskDescription);
        console.log('Reminder Hours:', reminderHours);
        console.log('Reminder Minutes:', reminderMinutes);
        console.log('Image Url:', imageUrl);

        if (taskValue) {
            fetch(`${API_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "name": taskValue,
                    "description": taskDescription,
                    "reminder": { 
                        "hours": reminderHours,
                        "minutes": reminderMinutes,
                    },
                    "imageUrl": imageUrl,
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                generate_list(data)
            }).catch(e => {
                console.log(e);
            })

            taskInput.value = '';
            descriptionInput.value = '';
            hoursInput.value = '';
            minutesInput.value = '';
            taskImageInput.value = '';
        } else {
            console.log('Please enter a task.');
        }
    });

    document.getElementById('task-list').addEventListener('change', (event) => {
        if (event.target.classList.contains('task-checkbox')) {
            const taskItem = event.target.closest('.task-item');
            const taskText = taskItem.querySelector('.task-text');
            id = event.target.dataset.id
            if (event.target.checked) {
                fetch(`${API_URL}/api/tasks/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        "completed": true,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    taskText.classList.add('completed-task');
                }).catch(e => {
                    console.log(e);
                })
            } else {
                fetch(`${API_URL}/api/tasks/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        "completed": false,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    taskText.classList.remove('completed-task');
                }).catch(e => {
                    console.log(e);
                })
            }
        }
    });

    fetch(`${API_URL}/api/tasks`, {
        headers: {'Authorization': `Bearer ${token}`},
    })
    .then(res => res.json())
    .then(tasks => {
        tasks.forEach(task => {
            console.log("=>", task)
            generate_list(task)
        })
    }).catch(e => {
        console.log(e);
    })

});