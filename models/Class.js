const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    schoolName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
