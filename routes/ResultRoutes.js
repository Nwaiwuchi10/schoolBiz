const Result = require("../models/Result");
const SubjectMarks = require("../models/SubjectMarks");
const User = require("../models/User");

const router = require("express").Router();

// /registerin

router.post("/", async (req, res) => {
  const userId = req.body.user;
  const schoolId = req.body.school;

  const { year, term, user, classes, subjects } = req.body; // Assuming the request body contains the Biology data as an array of test and exam objects
  const subjectId = await subjects.map((item) => ({
    subject: item.subject,
  }));
  // const modifyClass = class.replace(/\s+/g, "-");
  // Calculate the total score for each entry in the Biology array

  try {
    const ResultAlreadyExits = await Result.findOne({
      year,
      term,
      classes,
      user,
      schoolName: schoolId,
    });

    if (ResultAlreadyExits) {
      return res.status(404).json({ message: "User Result already Exits" });
    }

    // Create a new result document in the database with the Biology array containing total scores
    const newResult = new Result({
      subjects: subjectId,
      //   subjects: subjectObj.map((subject) => subject._id),
      user: userId,
      classes: classes,
      year: year,
      term: term,
      schoolRegNumber: req.body.schoolRegNumber,
      TotalScore: req.body.TotalScore,
      TotalAverage: req.body.TotalAverage,
      schoolName: req.body.schoolName,
      school: req.body.school,
      Position: req.body.Position,
      numberInClass: req.body.numberInClass,
      Remark: req.body.Remark,
      HmRemark: req.body.HmRemark,
      TotalGrade: req.body.TotalGrade,
      Signature: req.body.Signature,
    });
    await newResult.save();
    // Update the user's document with the new result ID

    await User.findByIdAndUpdate(userId, {
      $push: { results: newResult._id },
    });
    return res.status(201).json(newResult);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save the result." });
  }
});
router.get("/", async (req, res) => {
  try {
    const results = await Result.find({})
      .sort({ createdAt: -1 })
      .populate("subjects")

      .populate("user", [
        "firstName",
        "lastName",
        "schoolRegNumber",
        "currentClass",
      ])
      .populate("school", [
        "name",
        "address",
        "postalCode",
        "state",
        "city",
        "country",
        "phoneNumber",
      ]);

    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("subjects")

      .populate("user", [
        "firstName",
        "lastName",
        "schoolRegNumber",
        "currentClass",
      ])
      .populate("school", [
        "name",
        "address",
        "postalCode",
        "state",
        "city",
        "country",
        "phoneNumber",
      ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({ message: "This User result has been deleted" });
    } else {
      res.status(404).json({ message: "Result not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, classes, year, term, subjects } = req.body;
  const subjectScore = subjects.map((item) => ({
    subject: item.subject,
    test: item.test,
    exam: item.exam,
    totalScore: item.totalScore,
    grade: item.grade,
    remark: item.remark,
  }));

  try {
    const subjectsMarks = await SubjectMarks.findById(id);

    if (!subjectsMarks) {
      return res.status(404).json({ message: "Class Subject not found" });
    }

    // Update the user's current class
    subjectsMarks.subjects = subjectScore || subjectsMarks.subjects;
    subjectsMarks.classes = classes || subjectsMarks.classes;
    subjectsMarks.year = year || subjectsMarks.year;
    subjectsMarks.term = term || subjectsMarks.term;
    await subjects.save();

    res.json({ message: "Subject Score updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
