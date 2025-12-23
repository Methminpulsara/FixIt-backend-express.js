const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const requireRole = require('../middleware/requireRole')
const requestController = require('../controllers/requestController')
const upload = require('../middleware/uploadMiddleware')

// for all routers 
router.use(authMiddleware);

router.get('/get/history' , requestController.getMyRequests)

// get request 
router.get('/nearby', authMiddleware, requestController.getNearbyRequests);

// customer create request
router.post('/', requireRole("customer") ,upload.single('damageImage') ,  requestController.createRequest);

router.post('/:id/accept', requireRole(["mechanic","garage"]) , requestController.acceptRequest);

router.post('/:id/complete', requireRole(["mechanic" , "garage"]) , requestController.completeRequest);

//getmechanic status 
router.get('/provider-stats', authMiddleware, requestController.getProviderStats);

router.post('/update-location', authMiddleware, requestController.updateLocation);

module.exports = router;



