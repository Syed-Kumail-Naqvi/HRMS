const validator = require('validator');

exports.validateLogin = (email, password) => {
  const errors = {};
  
  if (!email || !validator.isEmail(email)) {
    errors.email = 'Valid email is required';
  }
  
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

exports.validateEmployee = async (name, email, password) => {
  const errors = {};
  
  if (!name || name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!email || !validator.isEmail(email)) {
    errors.email = 'Valid email is required';
  }
  
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

exports.validateCompany = (name, adminEmail) => {
  const errors = {};
  
  if (!name || name.trim() === '') {
    errors.name = 'Company name is required';
  }
  
  if (!adminEmail || !validator.isEmail(adminEmail)) {
    errors.adminEmail = 'Valid admin email is required';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};