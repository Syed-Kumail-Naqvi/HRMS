const Company = require('../models/Company');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const { generateResetToken } = require('../config/jwt');

exports.createCompany = async (req, res) => {
  const { name, logo, adminEmail, adminName } = req.body;

  try {
    const invitationToken = generateResetToken();
    
    const company = await Company.create({
      name,
      logo,
      invitationToken,
      invitationExpires: Date.now() + 86400000
    });
    
    const invitationUrl = `${process.env.FRONTEND_URL}/accept-invitation/${invitationToken}`;
    await sendEmail({
      to: adminEmail,
      subject: 'Company Invitation',
      text: `You've been invited to join ${name} as an admin. Click the link to accept: ${invitationUrl}`
    });
    
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acceptInvitation = async (req, res) => {
  const { token, name, email, password } = req.body;

  try {
    const company = await Company.findOne({ 
      invitationToken: token,
      invitationExpires: { $gt: Date.now() }
    });
    
    if(!company) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    const adminUser = await User.create({
      name,
      email,
      password,
      role: 'companyadmin',
      company: company._id
    });
    
    company.admin = adminUser._id;
    company.status = 1;
    company.invitationToken = undefined;
    company.invitationExpires = undefined;
    await company.save();
    
    res.status(201).json({
      message: 'Company activated successfully',
      company,
      user: adminUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('admin', 'name email');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCompanyStatus = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if(!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    company.status = req.body.status;
    await company.save();
    
    res.json({ message: 'Company status updated', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};