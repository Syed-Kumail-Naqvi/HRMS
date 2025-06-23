const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/companies', require('./companyRoutes'));
router.use('/employees', require('./employeeRoutes'));
router.use('/leaves', require('./leaveRoutes'));
router.use('/service-managers', require('./serviceManagerRoutes'));

module.exports = router;