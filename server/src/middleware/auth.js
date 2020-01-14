const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  console.log(req.body);
  
  try {
    const { user, token } = await findUser(req);
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({error: 'Please authenticate.'});
  }
}

const authManager = async (req, res, next) => {
  try {
    const { user, token } = await findUser(req);
    req.token = token;
    req.user = user;
    if(user.role !== 'manager' && user.role !== 'admin') {
      return res.status(401).send({error: 'Not allowed.'})
    }
    next();
  } catch (error) {
    res.status(401).send({error: 'Please authenticate.'});
  }
}

const authAdmin = async (req, res, next) => {
  try {
    const { user, token } = await findUser(req);
    req.token = token;
    req.user = user;
    if(user.role !== 'admin') {
      return res.status(401).send({error: 'Not allowed.'})
    }
    next();
  } catch (error) {
    res.status(401).send({error: 'Please authenticate.'});
  }
}
const findUser = async (req) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
  if(!user) {
    throw new Error();
  }
  return { user, token }
}

module.exports =  {
  auth,
  authManager,
  authAdmin
};