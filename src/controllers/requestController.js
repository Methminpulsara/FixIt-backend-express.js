
const requestService = require('../services/requestService')


// customer => create service request 
exports.createRequest = async (req, res) => {
    try {
        if (req.user.type !== "customer") {
             return res.status(403).json({ message: "Only customers can create requests." });
        }
        const io = req.app.get("socketio");
        
        const { lng, lat, requestType, issueDescription } = req.body;
        if (!lng || !lat || !requestType || !issueDescription) {
            return res.status(400).json({ message: "Missing required request details (location, type, description)." });
        }
        const result = await requestService.createServiceRequest(req.user.id, req.body, io);
        res.status(201).json({ success: true, request: result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// provide accept request
exports.acceptRequest = async (req, res) => {

    try {
        const providerType = req.user.type;
        if (providerType !== "mechanic" && providerType !== "garage") {
            return res.status(403).json({ message: "Access denied. Only service providers can accept requests." });
        }

        const requestId = req.params.id;
        const providerId = req.user.id;

        const result = await requestService.acceptRequest(requestId , providerId, providerType)
        res.json({success: true , result: result})
    }catch(error){
        res.status(400).json({message:error.message})
    }
    
}


exports.completeRequest = async (req, res) => {
    try {
        const providerType = req.user.type; 
        if (providerType !== "mechanic" && providerType !== "garage") {
             return res.status(403).json({ message: "Access denied." });
        }

        const requestId = req.params.id;
        const providerId = req.user.id; 

        const io= req.app.get("socketio")
        
        const result = await requestService.completeServiceRequest(requestId, providerId, io);
        
        res.json({ success: true, request: result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.type;
        
        const requests = await requestService.getRequestsByUserId(userId, userType);
        res.json({ success: true, requests });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}