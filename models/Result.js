const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "School",
    },
    schoolName: {
      type: String,

      required: true,
    },
    classes: {
      type: String,
      required: true,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Class",
    },
    year: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },

    schoolRegNumber: {
      type: String,
    },
    subjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubjectMarks",
        },
      },
    ],

    TotalScore: {
      type: Number,
      default: 0,
    },
    TotalAverage: {
      type: String,
    },
    Position: {
      type: String,
    },
    numberInClass: {
      type: Number,
    },
    TotalGrade: {
      type: String,
    },
    Remark: {
      type: String,
    },
    HmRemark: {
      type: String,
    },
    Signature: {
      type: String,
    },
    deActivateResultEdith: { type: Boolean, default: false },
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

module.exports = mongoose.model("Result", ResultSchema);
