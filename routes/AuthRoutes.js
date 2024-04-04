const router = require("express").Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const { default: generateToken } = require("../Utils/generateTokens");
const imagekit = require("../Utils/imagekit");
const User = require("../models/User");

// /registerin
router.post("/registers", async (req, res) => {
  const { schoolRegNumber } = req.body;
  const schoolId = req.body.schoolName;
  try {
    const userExist = await User.findOne({
      schoolRegNumber,
      schoolName: schoolId,
    });
    if (userExist) {
      return res.status(409).json({ error: "User already exists." });
    }
    const result = await imagekit.upload({
      file: req.body.passportPhoto,
      fileName: `${req.body.firstName}-${req.body.lastName}.jpg`,
      // width:300,
      // crop:"scale"
    });
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userType: req.body.userType,
      schoolName: req.body.schoolName,
      currentClass: req.body.currentClass,
      roles: req.body.roles,
      schoolRegNumber: req.body.schoolRegNumber,
      phoneNumber: req.body.phoneNumber,
      passportPhoto: result.url,
      contactAdress: req.body.contactAdress,
      // password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();

    res.status(200).json({
      // token: generateToken(user._id),
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      userType: user.userType,
      currentClass: user.currentClass,
      phoneNumber: user.phoneNumber,
      passportPhoto: user.passportPhoto,
      contactAdress: user.contactAdress,
      isAdmin: user.isAdmin,
      schoolRegNumber: user.schoolRegNumber,
      schoolName: user.schoolName,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//REGISTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "djnchrys@gmail.com",
    pass: "mictdtqklnuerfkg",
  },
});
router.post("/register", async (req, res) => {
  //  const {class}=req.body;
  //   const modifyClass = class.replace(/\s+/g, "_");
  try {
    //generate new password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // const existingUser = await User.findOne({ email });

    // if (existingUser) {
    //   return res.status(409).json({ error: "User already exists." });
    // }
    //create new user
    const result = await imagekit.upload({
      file: req.body.passportPhoto,
      fileName: `${req.body.firstName}-${req.body.lastName}.jpg`,
      // width:300,
      // crop:"scale"
    });
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userType: req.body.userType,
      currentClass: req.body.currentClass,

      roles: req.body.roles,
      schoolRegNumber: req.body.schoolRegNumber,
      phoneNumber: req.body.phoneNumber,
      passportPhoto: result.url,
      contactAdress: req.body.contactAdress,
      // password: hashedPassword,
    });
    ////nodemailer
    // const mailOptions = {
    //   from: "ourworldintschool1@gmail.com",
    //   to: req.body.email,
    //   subject: "Registration Successful",
    //   html: `<p>Hello ${req.body.firstName},</p>
    //   <p>Thank you for registering with Our World International Nursery & Primary Shool e-portal. Your account has successfully been created.</p><p>Click <a href="https://ourworldintschool.ng/">here</a> to vsiti return to the site</p>`,

    // };

    //save user and respond
    const user = await newUser.save();
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.status(200).json({
      // token: generateToken(user._id),
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,

      userType: user.userType,
      currentClass: user.currentClass,
      phoneNumber: user.phoneNumber,
      passportPhoto: user.passportPhoto,
      contactAdress: user.contactAdress,
      isAdmin: user.isAdmin,
      schoolRegNumber: user.schoolRegNumber,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// Student LOGIN
router.post("/student-loginss", async (req, res) => {
  try {
    const user = await User.findOne({
      schoolRegNumber: req.body.schoolRegNumber,
    });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json({
      // token: generateToken(user._id),
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      user: user.userType,
      phoneNumber: user.phoneNumber,
      passportPhoto: user.passportPhoto,
      contactAdress: user.contactAdress,
      isAdmin: user.isAdmin,
      schoolRegNumber: user.schoolRegNumber,
      currentClass: user.currentClass,
      schoolName: user.schoolName,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json({
      // token: generateToken(user._id),
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      user: user.userType,
      phoneNumber: user.phoneNumber,
      passportPhoto: user.passportPhoto,
      contactAdress: user.contactAdress,
      isAdmin: user.isAdmin,
      schoolRegNumber: user.schoolRegNumber,
      currentClass: user.currentClass,
      schoolName: user.schoolName,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//////login
router.post("/logins", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    // Set up a session or JWT token here if needed

    res.status(200).send("Login successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
///////
router.post("/student-login", async (req, res) => {
  try {
    const { schoolRegNumber, password } = req.body;
    const user = await User.findOne({ schoolRegNumber });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    // Set up a session or JWT token here if needed

    res.status(200).send({
      // token: generateToken(user._id),
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      user: user.userType,
      phoneNumber: user.phoneNumber,
      passportPhoto: user.passportPhoto,
      contactAdress: user.contactAdress,
      isAdmin: user.isAdmin,
      schoolRegNumber: user.schoolRegNumber,
      currentClass: user.currentClass,
      schoolName: user.schoolName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//Forgotten password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // 1. Check if the user with the given email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    ////nodemailer
    const mailOptions = {
      from: "djnchrys@gmail.com",
      to: req.body.email,
      subject: "Registration Successful",
      html: `<p>Hello ${req.body.user.firstName},</p>
      <p>You are about to reset Your account password.</p><p>Click <a href="http://your-app-url/reset-password/${user.token}">here</a> to confirm your password reset.</p>`,
      //   text: "Congratulations, your registration was successful!",
    };
    // Generate a unique token and save it in the user document
    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    // Send the password reset email
    const resetUrl = `http://your-app-url/reset-password/${token}`;
    sendPasswordResetEmail(email, resetUrl);

    res.json({ message: "Password reset instructions sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  try {
    // Find the user with the provided token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Render the password reset form
    res.render("reset-password", { token });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Forgotten password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    // Find the user with the provided token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const mailOptions = {
      from: "djnchrys@gmail.com",
      to: req.body.email,
      subject: "Registration Successful",
      html: `<p>Hello ${req.body.user.firstName},</p>
  <p>Your password has been reset sucessfully. Thanks</p>`,
      //   text: "Congratulations, your registration was successful!",
    };
    // Update the user's password and clear the reset token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
/// reset password
// Request a password reset token
router.post("/forgoten-password", async (req, res) => {
  const { schoolRegNumber } = req.body;

  try {
    const user = await User.findOne({ schoolRegNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token and set its expiry
    const resetToken = Math.random().toString(36).substr(2, 10);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    await user.save();

    // // Send the reset token to the user's email (you'll need to configure nodemailer)
    // const transporter = nodemailer.createTransport({
    //   // configure your mail transport
    // });

    // const mailOptions = {
    //   to: user.email,
    //   subject: 'Password Reset',
    //   text: `Your password reset token is: ${resetToken}`,
    // };

    // await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset token sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Reset password with a valid token
// Reset password route
router.post("/reset-user-password", async (req, res) => {
  const { schoolRegNumber, newPassword } = req.body;

  try {
    // Find the user by registration number
    const user = await User.findOne({ schoolRegNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne({ schoolRegNumber }, { password: hashedPassword });
    // user.password = hashedPassword;
    // await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

////////
module.exports = router;
