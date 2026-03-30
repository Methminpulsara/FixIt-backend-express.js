const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const reviewController = require('../controllers/reviewController')


router.post('/', authMiddleware , reviewController.createReview)

router.put('/:id', authMiddleware, reviewController.updateReview); 

router.delete('/:id', authMiddleware, reviewController.deleteReview);


module.exports =  router;