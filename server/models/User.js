const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'companyadmin', 'servicemanager', 'employee'],
    required: true 
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  status: { type: Number, enum: [1, 2], default: 1 },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await require('bcryptjs').compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await require('bcryptjs').genSalt(10);
  this.password = await require('bcryptjs').hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);