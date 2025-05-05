const Routine = require('../db/models/Routine');

const createRoutine = async (req, res) => {
  try {
    const newRoutine = new Routine({
      userId: req.body.userId,
      ...req.body.routineData,
      created: new Date()
    });

    await newRoutine.save();
    
    res.status(201).json(newRoutine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ userId: req.query.userId })
      .sort({ created: -1 });

    res.json(routines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRoutine, getUserRoutines };