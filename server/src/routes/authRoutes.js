const express = require('express');
const router = express.Router();
const { googleCallback, checkLogin } = require('../controllers/authController');

router.post('/google/callback', googleCallback);
router.get('/checkLogin', checkLogin);

module.exports = router;
