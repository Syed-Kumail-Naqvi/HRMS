const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const protect = require('../middleware/auth');
const { companyAdminOnly } = require('../middleware/role');

router.post('/', protect, companyAdminOnly, employeeController.createEmployee);
router.get('/', protect, employeeController.getEmployees);
router.put('/:id/status', protect, companyAdminOnly, employeeController.updateEmployeeStatus);

module.exports = router;