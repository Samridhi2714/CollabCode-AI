const express = require("express");
const router = express.Router();
const Version = require("../models/Version");
// ================= SAVE VERSION =================

router.post("/save", async (req, res) => {
  try {
        const { userId, roomId, files, message, committedBy } = req.body;
    // VALIDATION
    if (!userId || !roomId || !files || !message || !committedBy) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // CREATE VERSION
    const newVersion = new Version({
      userId,
      roomId,
      files,
      message,
      committedBy,
    });

    // SAVE TO DB
    await newVersion.save();
    res.status(201).json({
      success: true,
      message: "Version saved successfully",
      version: newVersion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving version",
      error: error.message,
    });
  }
});
// ================= GET USER COMMITS =================

router.get("/:userId", async (req, res) => {
  try {
    const versions = await Version.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(versions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching versions",
    });
  }
});
// ================= DELETE VERSION =================

router.delete("/:id", async (req, res) => {
  try {
    await Version.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Version deleted successfully",
    });
  } catch (error) {
    console.error("DELETE VERSION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting version",
    });
  }
});

module.exports = router;
