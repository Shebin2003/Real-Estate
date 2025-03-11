const express = require('express')
const router = express.Router()
const users = require('./users')
const properties = require('./properties')
const admin = require('./admin')

router.use('/users',users)
router.use('/properties',properties)
router.use('/admin',admin)

module.exports = router

