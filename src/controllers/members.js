const Member = require('../models/members');
const Trainer = require('../models/trainers');

// Create Member
exports.createMember = async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().populate('assignedTrainer', 'name specialization');
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Member by ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('assignedTrainer', 'name specialization');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Member
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Member
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Remove member from trainer's assigned list if linked
    if (member.assignedTrainer) {
      await Trainer.findByIdAndUpdate(member.assignedTrainer, {
        $pull: { assignedMembers: member._id }
      });
    }

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign Trainer to Member
exports.assignTrainer = async (req, res) => {
  const { memberId, trainerId } = req.body;
  try {
    const member = await Member.findById(memberId);
    const trainer = await Trainer.findById(trainerId);

    if (!member || !trainer) {
      return res.status(404).json({ message: 'Member or Trainer not found' });
    }

    // Unlink old trainer if exists
    if (member.assignedTrainer && member.assignedTrainer.toString() !== trainerId) {
      await Trainer.findByIdAndUpdate(member.assignedTrainer, {
        $pull: { assignedMembers: memberId }
      });
    }

    // Link new trainer
    member.assignedTrainer = trainerId;
    await member.save();

    if (!trainer.assignedMembers.includes(memberId)) {
      trainer.assignedMembers.push(memberId);
      await trainer.save();
    }

    res.status(200).json({ message: 'Trainer assigned successfully', member, trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};