exports.superAdminOnly = (req, res, next) => {
  if(req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Super Admin access only' });
  }
};

exports.companyAdminOnly = (req, res, next) => {
  if(req.user && req.user.role === 'companyadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Company Admin access only' });
  }
};

exports.serviceManagerOnly = (req, res, next) => {
  if(req.user && req.user.role === 'servicemanager') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Service Manager access only' });
  }
};

exports.employeeOnly = (req, res, next) => {
  if(req.user && req.user.role === 'employee') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Employee access only' });
  }
};