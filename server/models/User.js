// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Keep this import for matchPassword

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

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    // These console.logs are still useful for debugging, but remove in production
    console.log('--- Inside matchPassword method ---');
    console.log('Entered password (plain text - FOR DEBUG ONLY, REMOVE IN PROD):', enteredPassword); 
    console.log('Stored hashed password:', this.password);

    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('bcrypt.compare result (isMatch):', isMatch);
    console.log('--- Exiting matchPassword method ---');

    return isMatch;
};

// !!! THE userSchema.pre('save', ...) HOOK HAS BEEN REMOVED !!!
// It was causing the double hashing. The password should be hashed
// BEFORE calling User.create or User.findByIdAndUpdate in your controllers/services.

module.exports = mongoose.model('User', userSchema);