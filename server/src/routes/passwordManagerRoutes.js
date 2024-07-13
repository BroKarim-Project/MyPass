const express = require('express');
const router = express.Router();
const { addPassword, showPasswords, decryptPassword, deletePassword } = require('../controllers/passwordManagerController');
const { verifyUser } = require('../middleware/authMiddleware');

router.post('/add', verifyUser, addPassword);
router.delete('/delete/:id', verifyUser, deletePassword)
router.get('/show', verifyUser, showPasswords);
router.post('/decrypt', decryptPassword);

module.exports = router;