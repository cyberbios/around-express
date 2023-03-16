const router = require("express").Router();
const path = require("path");
const fs = require("fs").promises;

const dataPath = path.join(__dirname, "../data/cards.json");

router.get("/cards", (req, res) => {
  fs.readFile(dataPath, { encoding: "utf-8" })
    .then((cards) => {
      res.send(cards);
    })
    .catch(() =>
      res.status(500).send({ message: "We have encountered an error" })
    );
});

module.exports = router;
