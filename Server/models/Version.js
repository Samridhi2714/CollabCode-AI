const mongoose = require("mongoose");
const versionSchema = new mongoose.Schema(
  {
    // OWNER OF COMMIT
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ROOM WHERE COMMIT WAS MADE
    roomId: {
      type: String,
      required: true,
    },

    // FULL FILE SNAPSHOT
    files: [
    {
      name: String,
      language: String,
      content: String,
    },
  ],
    // COMMIT MESSAGE
    message: {
      type: String,
      required: true,
    },

    // USERNAME
    committedBy: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Version", versionSchema);
