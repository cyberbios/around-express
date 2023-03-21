const router = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

const dataPath = path.join(__dirname, '../data/users.json');

router.get('/users', (req, res) => {
  fs.readFile(dataPath, { encoding: 'utf-8' })
    .then((data) => {
      const user = JSON.parse(data);
      res.json(user);
    })
    .catch(() =>
      res.status(500).send({ message: 'We have encountered an error' })
    );
});

router.get('/users/:id', (req, res) => {
  fs.readFile(dataPath, { encoding: 'utf-8' })
    .then((data) => {
      const { id } = req.params;
      const foundUser = JSON.parse(data).find((user) => user._id === id);

      if (foundUser) {
        res.send(foundUser);
      } else {
        res.status(404).send({ message: 'User ID not found' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'We have encountered an error' });
    });
});

module.exports = router;
