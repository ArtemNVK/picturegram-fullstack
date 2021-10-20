const express = require('express');
const mongoose = require('mongoose');
const photoRouter = require('./routers/photoRouter');
const userRouter = require('./routers/userRouter');
const uploadRouter = require('./routers/uploadRouter');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enables CORS on Express.js

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});

mongoose.connect(process.env.MONGODB_CREDENTIALS, {});

app.use('/api/users', userRouter);
app.use('/api/photos', photoRouter);
app.use('/api/uploads', uploadRouter);


app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at ${port}`);
});
