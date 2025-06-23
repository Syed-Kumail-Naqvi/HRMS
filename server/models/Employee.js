const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  department: String,
  designation: String,
  status: { type: String, enum: ['active', 'on-leave'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);