const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const { auth, authManager, authAdmin } = require('../middleware/auth');
const router = new express.Router();

router.post('/users/singup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logoutAllDevices', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("Format not accepted"));
    }
    callback(undefined, true);
  }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({error: error.message});
});

router.post('/users/:userID/avatar', authManager, upload.single('avatar'), async (req, res) => {
  const _id = req.params.userID;
  try {
    const user = await User.findById(_id);
    if(!user) {
      return res.status(404).send();
    }
    const buffer = await sharp(req.file.buffer).toBuffer();
    user.avatar = buffer;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users', authManager, async (req, res) => {
    try {
      const count = await User.find({});
      const users = await User.find({}, null, {limit: parseInt(req.query.limit), skip: parseInt(req.query.skip)});
      const noOfPages = Math.ceil(count.length / parseInt(req.query.limit));
      res.send({
        count: count.length,
        noOfPages,
        users: users
      });
    } catch (error) {
      res.status(500).send();
    } 
});

router.get('/users/search', authManager, async (req, res) => {
  const searchTerm = req.query.search;
  try {
    const count = await User.find({ 
      $or: [
        { name: { "$regex": searchTerm, "$options": "i" }},
        { email: { "$regex": searchTerm, "$options": "i"}}
      ]}
    );
    const users = await User.find({ 
      $or: [
        { name: { "$regex": searchTerm, "$options": "i" }},
        { email: { "$regex": searchTerm, "$options": "i"}}
      ]}, 
      null,
      {limit: parseInt(req.query.limit), skip: parseInt(req.query.skip)}
    );
    const noOfPages =  count.length > parseInt(req.query.limit) ? Math.ceil(count.length / parseInt(req.query.limit)) : 1;
    res.send({
      count: count.length,
      noOfPages,
      users
    });
  } catch (error) {
    res.status(500).send();
  } 
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.get('/users/:userID', authManager, async (req, res) => {
  const _id = req.params.userID;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedOp = ['name', 'email', 'password', 'preferredWorkingHours'];
  const isValid = updates.every(update => allowedOp.includes(update));
  if (!isValid) {
    return res.status(400).send('Error, invalid updates!');
  }
  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/users/:userID', authManager, async (req, res) => {
  const _id = req.params.userID;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    const updates = Object.keys(req.body);
    const allowedOp = ['name', 'email', 'password', 'preferredWorkingHours'];
    const isValid = updates.every(update => allowedOp.includes(update));
    if (!isValid) {
      return res.status(400).send('Error, invalid updates!');
    }
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/users/:userID', authManager, async (req, res) => {
  const _id = req.params.userID;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send('Not found');
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/users/me/avatar', auth, async (req, res) => {  
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.delete('/users/:userID/avatar', authManager, async (req, res) => {
  const _id = req.params.userID;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send('Not found');
    }
    user.avatar = undefined;
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// User.collection.deleteMany({});
module.exports = router

