const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Photo = require('../models/PhotoModel');
const { isAuth } = require('../utils');
const jwt = require('jsonwebtoken');

const photoRouter = express.Router();

// create new picture

photoRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try { 
      const photo = new Photo({
      image: req.body.image,
      caption: req.body.caption,
      likes: [],
      comments: [],
      userId: req.body._id
      });
      const createdPhoto = await photo.save();
      res.send({
        _id: createdPhoto._id,
        image: createdPhoto.image,
        caption: createdPhoto.caption,
        likes: createdPhoto.likes,
        comments: createdPhoto.comments,
        userId: createdPhoto.userId,
      });
    } catch(error){
      console.log('ERROR', error);
      res.status(404).send({ message: "Oops, something went wrong!" })
    }
  })
);

// get photos by userId

photoRouter.get(
    '/user-pictures/:userId',
    expressAsyncHandler(async (req, res) => {
      const userId = req.params.userId;
      if (userId) {
        const response = await Photo.find({userId: mongoose.Types.ObjectId(userId)});
        res.status(200).send(response.reverse());
      } else {
          res.status(400).send({ message: 'UserId is not provided.' })
      }

    })
  );


// get followed users pictures

const getFeedPhotos = async (followingArr) => {        
  const promises = followingArr.map(userId => Photo.find({userId: mongoose.Types.ObjectId(userId)}));
  return Promise.all(promises);
};

photoRouter.post(
  '/feed/:page',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const following = req.body.following;
    const userId = req.body._id;
    const page = req.params.page;
    
    if (following && userId) {
      const results = {};

      const startIndex = (page - 1) * 5
      const endIndex = page * 5

      const ids = [...following, userId.toString()]
      const response = await getFeedPhotos(ids);
      const data = [].concat.apply([], response);
      const feed = data.reverse();

      if (endIndex + 1 >= feed.length) {
        results.photos = feed.slice(startIndex, feed.length - 1);
        results.noMoreResults = true;
        res.status(200).send(results);        
      } else {
        results.photos = feed.slice(startIndex, endIndex);
        results.noMoreResults = false;
        res.status(200).send(results);
      }


    } else {
        res.status(400).send({ message: 'Following is not provided.' })
    }

  })
);


// photoRouter.post(
//     '/feed',
//     expressAsyncHandler(async (req, res) => {
//       const following = req.body.following;
//       const userId = req.body._id;
//       if (following && userId) {
//         const ids = [...following, userId.toString()]
//         const response = await getFeedPhotos(ids);
//         const data = [].concat.apply([], response);
//         res.status(200).send(data.reverse());
//       } else {
//           res.status(400).send({ message: 'Following is not provided.' })
//       }

//     })
//   );

// like a picture

photoRouter.put(
  '/:id/like',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const picture = await Photo.findById(req.params.id);
    const user = req.body.userId;
    if (picture && user) {
      if (!picture.likes.includes(user)) {
        picture.likes = [...picture.likes, user];
      } else {
        picture.likes = picture.likes.filter(element => element !== user);
      }
    }

    const updatedPicture = await picture.save();

    res.send({
      _id: updatedPicture._id,
      image: updatedPicture.image,
      caption: updatedPicture.caption,
      likes: updatedPicture.likes,
      comments: updatedPicture.comments,
      userId: updatedPicture.userId,
    });
    
  })
);

// comment a picture

photoRouter.put(
  '/:id/add-comment',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const picture = await Photo.findById(req.params.id);
    const comment = req.body.comment;
    console.log(req.body);
    if (picture && comment) {
        picture.comments = [...picture.comments, comment];
    }

    const updatedPicture = await picture.save();
    res.send({
      _id: updatedPicture._id,
      image: updatedPicture.image,
      caption: updatedPicture.caption,
      likes: updatedPicture.likes,
      comments: updatedPicture.comments,
      userId: updatedPicture.userId,
    });
    
  })
);

// delete a comment

photoRouter.put(
  '/:id/delete-comment',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const picture = await Photo.findById(req.params.id);
    const comment = req.body.comment;
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
      jwt.verify(
        token,
        process.env.JWT_SECRET || 'somethingsecret',
        async (err, decode) => {
          if (err) {
            res.status(401).set('Access-Control-Allow-Origin', 'http://localhost:3000/').send({ message: 'Invalid Token' });
          } else {
            if (comment.userId.toString() === decode._id) {
              picture.comments = picture.comments.filter(c => c._id.toString() !== comment._id.toString());
              const updatedPicture = await picture.save();
              console.log('DELETE', updatedPicture);
              res.send({
                _id: updatedPicture._id,
                image: updatedPicture.image,
                caption: updatedPicture.caption,
                likes: updatedPicture.likes,
                comments: updatedPicture.comments,
                userId: updatedPicture.userId,
              });
            } else {
              res.status(401).send({message: 'You can delete only your own comments!'});
            }
          }
        }
      );
    }
  })
);

// get a single picture

photoRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    if (photo) {
      res.send(photo);
    } else {
      res.status(404).send({ message: 'Photo Not Found' });
    }
  })
);

module.exports = photoRouter;
