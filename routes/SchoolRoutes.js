const Class = require("../models/Class");
const School = require("../models/School");

const router = require("express").Router();

// /registerin

router.get("/", async (req, res) => {
  try {
    const school = await School.find({}).sort({ createdAt: -1 });
    res.json(school);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    res.status(200).json(school);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (school) {
      res.status(200).json({ message: "This School has been deleted" });
    } else {
      res.status(404).json({ message: "School not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
