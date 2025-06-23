const express = require('express');
const router = express.Router();
const serviceManagerController = require('../controllers/serviceManagerController');
const protect = require('../middleware/auth');
const { companyAdminOnly } = require('../middleware/role');

router.post('/', protect, companyAdminOnly, serviceManagerController.createServiceManager);
router.get('/', protect, companyAdminOnly, serviceManagerController.getServiceManagers);

module.exports = router;