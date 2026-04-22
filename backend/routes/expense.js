const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/authMiddleware");

// ADD
router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category,
    });

    await expense.save();
    res.json(expense);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE (FINAL CORRECT VERSION)
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    await expense.deleteOne();

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;