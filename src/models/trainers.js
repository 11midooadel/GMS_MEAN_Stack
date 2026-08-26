const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  assignedMembers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);