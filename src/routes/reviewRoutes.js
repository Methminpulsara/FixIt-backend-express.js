const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const reviewController = require('../controllers/reviewController')


// create 
router.post('/', authMiddleware , reviewController.createReview)

// edit
router.put('/:id', authMiddleware, reviewController.updateReview); 

// delete
router.delete('/:id', authMiddleware, reviewController.deleteReview);


module.exports =  router;