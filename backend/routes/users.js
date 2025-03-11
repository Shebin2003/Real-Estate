const express = require('express')

const router = express.Router()
const { users } = require('../controllers')

router.post('/login',users.userLogin)           // Login
router.post('/register',users.userRegister)     // Register

module.exports = router