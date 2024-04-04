const mongoose = require("mongoose");

const ScratchcardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
  schoolName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  serialNumber: { type: String, required: true, unique: true },
  pin: { type: String, required: true, unique: true },
  name: { type: String },
  usageCount: {
    type: Number,
    default: 0,
  },
  // Add other fields as needed
});

const Scratchcard = mongoose.model("Scratchcard", ScratchcardSchema);

module.exports = Scratchcard;
