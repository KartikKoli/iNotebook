const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route-1 Get all the notes using GET "/api/notes/getuser" Login is required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});

//Route-2 Add notes using POST "/api/notes/addnote" Login is required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title!").isLength({ min: 1 }),
    body("description", "Description must be atleast 3 characters!").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error!");
    }
  }
);

//Route-3 Update an existing note using PUT "/api/notes/updatenote" Login is required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
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

    // Find the note to be updated
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found!");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not allowed!");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});

//Route-4 Delete an existing note using DELETE "/api/notes/deletenote" Login is required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found!");
    }

    //Authenticate if the user is valid
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not allowed!");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "The note has been deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
