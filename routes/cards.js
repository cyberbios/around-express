const router = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

const dataPath = path.join(__dirname, '../data/cards.json');

router.get('/cards', (req, res) => {
  fs.readFile(dataPath, { encoding: 'utf-8' })
    .then((data) => {
      const card = JSON.parse(data);
      res.json(card);
    })
    .catch(() =>
      res.status(500).send({ message: 'We have encountered an error' })
    );
});

router.get('/cards/:id', (req, res) => {
  fs.readFile(dataPath, { encoding: 'utf-8' })
    .then((data) => {
      const { id } = req.params;
      const foundCard = JSON.parse(data).find((card) => card._id === id);

      if (foundCard) {
        res.send(foundCard);
      } else {
        res.status(404).send({ message: 'Card ID not found' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'We have encountered an error' });
    });
});

module.exports = router;
