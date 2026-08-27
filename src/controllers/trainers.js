const Trainer = require('../models/trainers');
const Member = require('../models/members');

// Create Trainer
exports.createTrainer = async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.status(201).json(trainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().populate('assignedMembers', 'name email');
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Trainer by ID
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate('assignedMembers', 'name email');
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Trainer
exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.status(200).json(trainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    // Unassign trainer from all linked members
    await Member.updateMany(
      { assignedTrainer: req.params.id },
      { $set: { assignedTrainer: null } }
    );

    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
