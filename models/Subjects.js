const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const SubjectsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    schoolName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    classes: {
      // type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtual: true,
    },
    toObject: {
      virtual: true,
    },
  }
);

module.exports = mongoose.model("Subjects", SubjectsSchema);
