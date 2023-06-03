const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({
    address: req.ip,
    method: req.method,
    protocol: req.protocol,
    header: req.headers,
  });
});
router.get(["/ip", "/ips"], (req, res) => {
    res.json(req.ip);
});

router.get(["/head", "/header", "/headers", "/h"], (req, res) => {
    res.json(req.headers);
});

router.get("/method", (req, res) => {
    res.json(req.method);
});

router.get(["/protocol", "/protocol"], (req, res) => {
    res.json(req.protocol);
});

module.exports = router