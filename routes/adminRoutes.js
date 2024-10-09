const express = require('express');
const { registerAdmin, loginAdmin, getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/assignments', auth, getAssignments);
router.post('/assignments/:id/accept', auth, acceptAssignment);
router.post('/assignments/:id/reject', auth, rejectAssignment);

module.exports = router;
