const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const protect = require('../middleware/auth');
const { companyAdminOnly } = require('../middleware/role');

router.post('/', protect, leaveController.createLeave);
router.get('/', protect, leaveController.getLeaves);
router.put('/:id/status', protect, companyAdminOnly, leaveController.updateLeaveStatus);

module.exports = router;