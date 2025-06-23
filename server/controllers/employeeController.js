const Employee = require('../models/Employee');
const User = require('../models/User');

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;
    
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
      role: 'employee',
      company: req.user.company
    });
    
    // Create employee
    const employee = await Employee.create({
      user: user._id,
      company: req.user.company,
      department,
      designation
    });
    
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ company: req.user.company })
      .populate('user', 'name email status');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Update user status
    await User.findByIdAndUpdate(employee.user, { status: req.body.status });
    
    res.json({ message: 'Employee status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};