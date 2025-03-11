const express = require('express')
const router = express.Router()

const { admin } = require('../controllers')

router.post('/adminlogin',admin.adminLogin)    // admin login
router.get('/fetchUsers',admin.fetchUsers)     // Fetch list of users

module.exports = router