const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const limiter = require('./constants/rateLimit');

const { PORT = 3000 } = process.env;

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { NOT_FOUND } = require('./constants/utils');

const app = express();

app.use(helmet());
app.use(limiter);

// body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to set temporary user
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // paste the _id of the test user created in the previous step
  };

  next();
});

// routes
app.use('/', usersRouter);
app.use('/', cardsRouter);

// error handling middleware
app.use((err, req, res) => {
  res.status(NOT_FOUND).send({ message: 'Resource not found' });
});

// connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/aroundb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      //  console.log(`App listening on port ${PORT}`);
    });
  });
