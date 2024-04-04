const router = require("express").Router();
const nodemailer = require("nodemailer");

const imagekit = require("../Utils/imagekit");
const School = require("../models/School");
const getRandom = require("../Utils/RandomNumbers");

// /registerin
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "djnchrys@gmail.com",
    pass: "mictdtqklnuerfkg",
  },
});
router.post("/", async (req, res) => {
  const { schoolRegCode, name } = req.body;
  const modifyName = name.replace(/\s+/g, "_");
  try {
    const schoolExist = await School.findOne({
      schoolRegCode,
    });
    if (schoolExist) {
      return res.status(409).json({ error: "School already exists." });
    }
    const logo = await imagekit.upload({
      file: req.body.schoolLogo,
      fileName: `${req.body.name}-${req.body.name}.jpg`,
      // width:300,
      // crop:"scale"
    });
    const uniqueNumber = getRandom(6);
    const newSchool = new School({
      name: modifyName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      country: req.body.country,
      city: req.body.city,
      schoolType: req.body.schoolType,
      state: req.body.state,
      schoolRegCode: `Edu${uniqueNumber}`,
      phoneNumber: req.body.phoneNumber,
      schoolLogo: logo.url,
      address: req.body.address,
      postalCode: req.body.postalCode,
    });
    //nodemailer
    const mailOptions = {
      from: "djnchrys@gmail.com",
      to: req.body.email,
      subject: "Your School Registration is Successful",
      html: `<p>Hello ${req.body.name},</p>
      <p>Thank you for registering with Our World International Nursery & Primary Shool e-portal. Your account has successfully been created.</p><p>Click <a href="https://ourworldintschool.ng/">here</a> to vsiti return to the site</p>`,
    };
    //save user and respond
    const school = await newSchool.save();
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.status(200).json({
      // token: generateToken(user._id),
      _id: school._id,
      name: school.name,
      email: school.email,
      schoolRegCode: school.schoolRegCode,
      postalCode: school.postalCode,
      schoolType: school.schoolType,
      city: school.city,
      phoneNumber: school.phoneNumber,
      schoolLogo: school.schoolLogo,
      address: school.address,
      state: school.state,
      country: school.country,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// School LOGIN
router.post("/schoolLogin", async (req, res) => {
  const { schoolRegCode, email } = req.body;
  try {
    const school = await School.findOne({
      schoolRegCode,
      email,
    });
    !school && res.status(404).json("School not found");

    res.status(200).json({
      // token: generateToken(user._id),
      _id: school._id,
      name: school.name,
      email: school.email,
      schoolRegCode: school.schoolRegCode,
      postalCode: school.postalCode,
      schoolType: school.schoolType,
      city: school.city,
      phoneNumber: school.phoneNumber,
      schoolLogo: school.schoolLogo,
      address: school.address,
      state: school.state,
      country: school.country,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//////// payment section
router.put("/payment/:id", async (req, res) => {
  const { id } = req.params;
  const { paymentAmount, paymentDate, expiryDate } = req.body;

  try {
    const payment = await School.findById(id);
    if (!payment) {
      return res.status(404).send({ message: "School not found" });
    }
    const paymentDate = new Date();
    const expiryDate = new Date(
      paymentDate.getFullYear() + 1,
      paymentDate.getMonth(),
      paymentDate.getDate()
    ); // m is 1 year

    (payment.paymentAmount = paymentAmount || payment.paymentAmount),
      (payment.paymentDate = paymentDate || payment.paymentDate),
      (payment.expiryDate = expiryDate || payment.expiryDate);

    await payment.save();
    res.status(201).json({
      // token: generateToken(user._id),
      _id: payment._id,
      name: payment.name,
      paymentAmount: payment.paymentAmount,
      paymentDate: payment.paymentDate,
      expiryDate: payment.expiryDate,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Route for validating payment
router.get("/payment/:id/validate", async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await School.findById(id);
    if (!payment) {
      return res.status(404).send({ message: "School not found" });
    }

    const currentDate = new Date();
    if (
      currentDate >= payment.paymentDate &&
      currentDate <= payment.expiryDate
    ) {
      res.send({ valid: true });
    } else {
      res.send({ valid: false });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
