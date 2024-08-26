const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    reminder: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
    },
    imageUrl: String,
    completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);