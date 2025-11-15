const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

// No middleware - direct access

 //GET /users/profile - View your profile
 
router.get('/profile', userCtrl.getProfile);


 //PUT /users/profile - Update your profile

router.put('/profile', userCtrl.updateProfile);

// POST /users/profile/image - Upload profile image (now accepts base64 data)

router.post('/profile/image', userCtrl.uploadProfileImage);


 //DELETE /users/account - Delete your account
 
router.delete('/account', userCtrl.deleteUser);

 // GET /users/stats - Your ride statistics

router.get('/stats', userCtrl.getUserStats);

module.exports = router;
