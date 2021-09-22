const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const { generateToken, isAuth, isEmailValid, isPasswordValid } = require('../utils');
const bcrypt = require('bcryptjs');

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          following: user.following,
          followers: user.followers,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const emailValid = isEmailValid(req.body.email);
    if(!emailValid) {
      return res.status(400).send({ message: 'Enter valid email' });
    }
    const messages = isPasswordValid(req.body.password);
    if(messages.length > 0) {
      return res.status(400).send({ message: messages[0] });
    }

    try { 
      const user = new User({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      following: [],
      followers: [],
      });
      const createdUser = await user.save();
      res.send({
        _id: createdUser._id,
        username: createdUser.username,
        fullname: createdUser.fullname,
        email: createdUser.email,
        following: createdUser.following,
        followers: createdUser.followers,
        token: generateToken(createdUser),
      });
    } catch(error){
      console.log(error);
      res.status(404).send({ message: `${error}` })
    }
  })
);

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

  userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.body.userId);
      const userToFollow = await User.findById(req.body.userToFollowId);

      if (user && userToFollow) {
        if (!user.following.includes(userToFollow._id.toString()) && !userToFollow.followers.includes(user._id.toString())) {
          user.following = [...user.following, userToFollow._id.toString()];
          userToFollow.followers = [...userToFollow.followers, user._id.toString()]; 
        } else {
          user.following = user.following.filter(element => element !== userToFollow._id.toString());
          userToFollow.followers = userToFollow.followers.filter(element => element !== user._id.toString());
        }
      }
      const updatedUser = await user.save();
      const updatedUserToFollow = await userToFollow.save();
      res.send({
          user: {
            _id: updatedUser._id,
            username: updatedUser.username,
            fullname: updatedUser.fullname,
            email: updatedUser.email,
            following: updatedUser.following,
            followers: updatedUser.followers,
            token: generateToken(updatedUser),
        },
          userToFollow: {
            _id: updatedUserToFollow._id,
            username: updatedUserToFollow.username,
            fullname: updatedUserToFollow.fullname,
            email: updatedUserToFollow.email,
            following: updatedUserToFollow.following,
            followers: updatedUserToFollow.followers,
            token: generateToken(updatedUserToFollow),
          },
      });
    })
  );

  userRouter.get(
    '/suggested-profiles/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const userId = req.params.id;
      const user = await User.findById(req.params.id);
      const users = await User.find({});
      const filtered = users.filter(profile => profile._id.toString() !== user._id.toString() && !profile.followers.includes(user._id.toString()));
      const suggestedProfiles = filtered.slice(0, 10);
      res.send(suggestedProfiles);
    })
  );

module.exports = userRouter;
