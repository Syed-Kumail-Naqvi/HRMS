const ServiceManager = require('../models/ServiceManager');
const User = require('../models/User');

exports.createServiceManager = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'servicemanager',
      company: req.user.company
    });
    
    // Create service manager
    const serviceManager = await ServiceManager.create({
      user: user._id,
      company: req.user.company,
      department
    });
    
    res.status(201).json(serviceManager);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getServiceManagers = async (req, res) => {
  try {
    const serviceManagers = await ServiceManager.find({ company: req.user.company })
      .populate('user', 'name email status');
    res.json(serviceManagers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};