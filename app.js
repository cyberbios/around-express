const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(userRouter);
app.use(cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Request resource not found' });
});

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
