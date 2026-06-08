const express = require("express");
const router = express.Router();

const { executeCode } = require("../controllers/executeController");

router.post("/", executeCode);

module.exports = router;