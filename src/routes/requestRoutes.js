const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const requireRole = require('../middleware/requireRole')
const requestController = require('../controllers/requestController')

// for all routers 
router.use(authMiddleware);

router.get('/get/history' , requestController.getMyRequests)

// customer create request
router.post('/', requireRole("customer") , requestController.createRequest);


router.post('/:id/accept', requireRole(["mechanic","garage"]) , requestController.acceptRequest);



router.post('/:id/complete', requireRole(["mechanic" , "garage"]) , requestController.completeRequest);




module.exports = router;



