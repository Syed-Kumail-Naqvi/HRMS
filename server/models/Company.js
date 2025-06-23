const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: Number, enum: [1, 2], default: 1 },
  invitationToken: String,
  invitationExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);