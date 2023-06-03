const express = require("express");
const router = express.Router();

//app.use(express.json()) // for parsing application/json
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

router.post("/", (req, res) => {
  console.log(req.body);
  res.send({
    data: req.body,
  });
});

module.exports = router