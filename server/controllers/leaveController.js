const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

exports.createLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    
    // Find employee for the user
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const leave = await Leave.create({
      employee: employee._id,
      company: employee.company,
      startDate,
      endDate,
      reason
    });
    
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    let leaves;
    if (req.user.role === 'companyadmin') {
      // Company admin can see all leaves of their company
      leaves = await Leave.find({ company: req.user.company })
        .populate('employee', 'department designation')
        .populate({
          path: 'employee',
          populate: { path: 'user', select: 'name email' }
        });
    } else {
      // Employee can only see their own leaves
      const employee = await Employee.findOne({ user: req.user._id });
      leaves = await Leave.find({ employee: employee._id });
    }
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    // Only company admin can update leave status
    if (req.user.role !== 'companyadmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    leave.status = status;
    await leave.save();
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};