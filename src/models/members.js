const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  assignedTrainer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trainer', 
    default: null 
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);