const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');
const { auth, authManager, authAdmin } = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks/mytasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.post('/tasks/:userID', authAdmin, async (req, res) => {
  const _id = req.params.userID;
  const task = new Task({
    ...req.body,
    owner: _id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.get('/tasks/all', authManager, async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  } 
});

router.get('/tasks/mytasks', auth, async (req, res) => {
  const match = {};
  const sort = {};
  switch(req.query.status) {
    case 'completed':
      match.status = 'completed';
      break;
    case "ongoing":
      match.status = 'ongoing';
      break;
    case "todo":
      match.status = 'todo';
      break;
  }  
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/tasks/:userID', authManager, async (req, res) => {
  const _id = req.params.userID;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send('Not found');
    }
    await user.populate({
      path: 'tasks'
    }).execPopulate();
    res.send(user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/tasks/mytasks/:taskID', auth, async (req, res) => {
  const _id = req.params.taskID;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id});
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/tasks/:userID/:taskID', authAdmin, async (req, res) => {
  const taskID = req.params.taskID;
  const userID = req.params.userID;
  try {
    const task = await Task.findOne({_id: taskID, owner: userID});
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/tasks/mytasks/:taskID', auth, async (req, res) => {
  const _id = req.params.taskID;
  const updates = Object.keys(req.body);
  const allowedOp = ['title', 'status', 'workedHours', 'description'];
  const isValidOp = updates.every(update => allowedOp.includes(update));
  if (!isValidOp) {
    return res.status(400).send('Invalid updates');
  }
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/tasks/:userID/:taskID', authAdmin, async (req, res) => {
  const taskID = req.params.taskID;
  const userID = req.params.userID;
  const updates = Object.keys(req.body);
  const allowedOp = ['title', 'status', 'workedHours', 'description'];
  const isValidOp = updates.every(update => allowedOp.includes(update));
  if (!isValidOp) {
    return res.status(400).send('Invalid updates');
  }
  try {
    const task = await Task.findOne({ _id: taskID, owner: userID });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/tasks/mytasks/:taskID', auth, async (req, res) => {
  const _id = req.params.taskID;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/tasks/:userID/:taskID', authAdmin, async (req, res) => {
  const taskID = req.params.taskID;
  const userID = req.params.userID;
  try {
    const task = await Task.findOneAndDelete({ _id: taskID, owner: userID });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;