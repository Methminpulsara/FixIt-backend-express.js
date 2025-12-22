const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const reviewController = require('../controllers/reviewController')


// DELETE EDIT EKKTH HADNN 
router.post('/', authMiddleware , reviewController.createReview)

module.exports =  router;