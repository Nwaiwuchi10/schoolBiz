const mongoose = require("mongoose");

const CommunativeResultSchema = new mongoose.Schema(
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
    },
    year: {
      type: String,
    },
    term: {
      type: String,
    },

    schoolRegNumber: {
      type: String,
    },
    subjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
        total1stTermScore: {
          type: Number,
          default: 0,
        },
        total2ndTermScore: {
          type: Number,
          default: 0,
        },
        total3rdTermScore: {
          type: Number,
          default: 0,
        },
        totalScore: {
          type: Number,
          default: 0,
        },
        totalAverage: {
          type: String,
        },
        grade: {
          type: String,
        },
        remark: {
          type: String,
        },
      },
    ],

    TotalScore: {
      type: Number,
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

module.exports = mongoose.model("CommunativeResult", CommunativeResultSchema);
