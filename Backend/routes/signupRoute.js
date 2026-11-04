const express = require('express');
const router = express.Router();
const userSignUpController = require('../controllers/signupcontroller');

router.post('/', userSignUpController.userSignUp);


module.exports = router;