const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    reminder: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
    },
    imageUrl: String,
    completed: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);