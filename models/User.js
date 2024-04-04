const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = mongoose.Schema.Types;
const UserSchema = new mongoose.Schema(
  {
    schoolName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    schoolRegNumber: {
      type: String,
      unique: true,
      required: true,
    },

    passportPhoto: {
      type: String,
    },

    currentClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    contactAdress: {
      type: String,
      required: true,
      max: 100,
    },
    roles: { type: String },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    deactivateUserRole: {
      type: Boolean,
      default: false,
    },
    userType: { type: String, default: "Student" },

    deactivateUserRole: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      // required: true,
      min: 6,
      max: 12,
      default: "123456",
    },
    // resetToken: { type: String },
    // resetTokenExpiry: { type: Date },
    results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }],
    communativeResults: [
      { type: mongoose.Schema.Types.ObjectId, ref: "CommunativeResult" },
    ],
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
UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
