const Class = require("../models/Class");
const SubjectMarks = require("../models/SubjectMarks");
const Subjects = require("../models/Subjects");

const router = require("express").Router();

// /registerin

router.post("/", async (req, res) => {
  const classId = req.body.classes;
  const schoolId = req.body.schoolName;
  const userId = req.body.user;
  const { year, term, subjects } = req.body;
  const subjectScore = subjects.map((item) => ({
    subject: item.subject,
    test: item.test,
    exam: item.exam,
    totalScore: item.totalScore,
    grade: item.grade,
    remark: item.remark,
  }));

  try {
    // const subjectId = await Subjects.findById(req.params.id);

    const existingSubjectMarks = await SubjectMarks.findOne({
      classes: classId,
      schoolName: schoolId,
      // subjects: subjectId,
      "subjects.subject": subjects.subject,
      user: userId,
      year,
      term,
    });

    if (existingSubjectMarks) {
      return res
        .status(409)
        .json({ error: "Subject Score Sheet for this class already exists." });
    }
    //create new user

    const newSubjectMarks = new SubjectMarks({
      subjects: subjectScore,
      user: req.body.user,
      classes: req.body.classes,
      year: req.body.year,
      term: req.body.term,
      schoolName: req.body.schoolName,
    });

    const subjectsMarks = await newSubjectMarks.save();

    res.status(200).json({
      _id: subjectsMarks._id,
      user: subjectsMarks.user,
      subjects: subjectsMarks.subjects,
      classes: subjectsMarks.classes,
      year: subjectsMarks.year,
      schoolName: subjectsMarks.schoolName,
      term: subjectsMarks.term,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", async (req, res) => {
  try {
    const subjectsMarks = await SubjectMarks.find({})
      .sort({ createdAt: -1 })
      .populate("classes", ["name"])
      .populate("subjects.subject", ["name", "classes"])
      .populate("user", [
        "firstName",
        "lastName",
        "schoolRegNumber",
        "currentClass",
      ])
      .populate("schoolName", ["name"]);
    res.json(subjectsMarks);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const subjectsMarks = await SubjectMarks.findById(req.params.id)
      .populate("classes", ["name"])
      .populate("subjects.subject", ["name", "classes"])
      .populate("schoolName", ["name"]);

    res.status(200).json(subjectsMarks);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const subjectsMarks = await SubjectMarks.findByIdAndDelete(req.params.id);
    if (subjectsMarks) {
      res
        .status(200)
        .json({ message: "This Class Subject Marks has been deleted" });
    } else {
      res.status(404).json({ message: "Class Subject Marks not found" });
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
