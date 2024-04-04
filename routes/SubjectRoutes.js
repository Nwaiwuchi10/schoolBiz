const Class = require("../models/Class");
const Subjects = require("../models/Subjects");

const router = require("express").Router();

// /registerin

router.post("/", async (req, res) => {
  const { name } = req.body;
  const classId = req.body.classes;
  const schoolId = req.body.schoolName;
  try {
    const existingSubject = await Subjects.findOne({
      name,
      classes: classId,
      schoolName: schoolId,
    });

    if (existingSubject) {
      return res.status(409).json({ error: "Class Subject already exists." });
    }
    //create new user

    const newSubject = new Subjects({
      name: req.body.name,
      classes: req.body.classes,
      schoolName: req.body.schoolName,
    });

    const subjects = await newSubject.save();

    res.status(200).json({
      _id: subjects._id,

      name: subjects.name,
      classes: subjects.classes,
      schoolName: subjects.schoolName,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", async (req, res) => {
  try {
    const subjects = await Subjects.find({})
      .sort({ createdAt: -1 })
      .populate("classes", ["name"])
      .populate("schoolName", ["name"]);
    res.json(subjects);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const subjects = await Subjects.findById(req.params.id)
      .populate("classes", ["name"])
      .populate("schoolName", ["name"]);

    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const subject = await Subjects.findByIdAndDelete(req.params.id);
    if (subject) {
      res.status(200).json({ message: "This Class Subject has been deleted" });
    } else {
      res.status(404).json({ message: "Class Subject not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { classes, name } = req.body;
  try {
    const subjects = await Subjects.findById(id);

    if (!subjects) {
      return res.status(404).json({ message: "Class Subject not found" });
    }

    // Update the user's current class
    subjects.name = name || subjects.name;
    subjects.classes = classes || subjects.classes;
    await subjects.save();

    res.json({ message: "Class Subject updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
