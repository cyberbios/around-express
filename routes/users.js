const router = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

const dataPath = path.join(__dirname, '../data/users.json');

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  // read users fs promise
  fs.readFile(dataPath, { encoding: 'utf-8' })
    .then((data) => {
      const { id } = req.params;

      // find user by id
      const user = JSON.parse(data).find((u) => u.id === id);

      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'User ID not found' }); // user does not exist
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'We have encountered an error' }); // response server error
    });
});

module.exports = router;
