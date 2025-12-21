const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const chatControlleer = require('../controllers/chatController');

router.get('/:requestId',authMiddleware,  chatControlleer.getChatHistory )
router.get('/',chatControlleer.print)


module.exports = router;