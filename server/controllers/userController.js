const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ company: req.user.company });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Only super admin or company admin can update
    if (req.user.role === 'superadmin' || 
        (req.user.role === 'companyadmin' && user.company.equals(req.user.company))) {
      user.status = req.body.status;
      await user.save();
      res.json(user);
    } else {
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Set new password
    user.password = req.body.newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};