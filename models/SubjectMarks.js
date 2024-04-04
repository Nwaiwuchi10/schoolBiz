const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const SubjectMarksSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    schoolName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    subjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subjects",
        },
        test: {
          type: Number,
          default: 0,
        },
        exam: {
          type: Number,
          default: 0,
        },
        totalScore: {
          type: Number,
          default: 0,
        },
        grade: {
          type: String,
        },
        remark: {
          type: String,
        },
      },
    ],
    classes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    term: {
      type: String,
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

module.exports = mongoose.model("SubjectMarks", SubjectMarksSchema);
