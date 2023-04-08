const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//route 1 fetch all notes of a user

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {}
});

//route 2 add notes

router.post(
  "/addnote",
  fetchuser,
  [
    body("title").isLength({ min: 3 }).withMessage("write a valid title"),
    body("description").isLength({ min: 5 }).withMessage("write a description"),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const noteSave = await note.save();
      res.json(noteSave);
    } catch (error) {
      res.json(error.massage);
    }
  }
);

//route 3 update existing note ""

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be update and update it

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(400).send("not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(400).send("not allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

//route 4 delete existing note ""

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //find the note to be delete and delete it
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(400).send("not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(400).send("not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "note has been deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
