const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    default: 'todo'
  },
  workedHours: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  startedAt: {
    type: Date,
    default: new Date()
  },
  endedAt: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;