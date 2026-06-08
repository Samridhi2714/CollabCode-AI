const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

router.get("/dashboard", auth, (req, res) => {
  res.json({
    msg: "Welcome to protected route ",
    userId: req.user
  });
});

module.exports = router;