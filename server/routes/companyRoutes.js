const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const protect = require('../middleware/auth');
const { superAdminOnly } = require('../middleware/role');

router.post('/', protect, superAdminOnly, companyController.createCompany);
router.post('/accept-invitation', companyController.acceptInvitation);
router.get('/', protect, superAdminOnly, companyController.getCompanies);
router.put('/:id/status', protect, superAdminOnly, companyController.updateCompanyStatus);

module.exports = router;