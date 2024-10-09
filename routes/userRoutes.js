const express = require('express');
const { registerUser, loginUser, uploadAssignment, getAdmins } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/upload', auth, uploadAssignment);
router.get('/admins', getAdmins);

module.exports = router;
