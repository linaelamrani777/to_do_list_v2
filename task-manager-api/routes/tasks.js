const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    const task = new Task({
        name: req.body.name,
        description: req.body.description,
        reminder: {
            hours: req.body.reminder.hours || 0,
            minutes: req.body.reminder.minutes || 0
        },
        imageUrl: req.body.imageUrl,
        completed: req.body.completed || false
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a task
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            task.name = req.body.name || task.name;
            task.description = req.body.description || task.description;
            task.reminder.hours = req.body.reminder.hours || task.reminder.hours;
            task.reminder.minutes = req.body.reminder.minutes || task.reminder.minutes;
            task.imageUrl = req.body.imageUrl || task.imageUrl;
            task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (task) {
            res.json({ message: 'Task deleted' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;