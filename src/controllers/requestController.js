
const requestService = require('../services/requestService')


// customer => create service request 
exports.createRequest = async (req, res) => {
    try {
        if (req.user.type !== "customer") {
            return res.status(403).json({ message: "Only customers can create requests." });
        }

        const io = req.app.get("socketio");
        
        // Multer හරහා පින්තූරයක් ඇවිත් තියෙනවාද බලන්න
        const damageImage = req.file ? `/uploads/${req.file.filename}` : null;

        const { lng, lat, requestType, issueDescription, vehicleDetails } = req.body;

        if (!lng || !lat || !requestType || !issueDescription) {
            return res.status(400).json({ message: "Missing required details." });
        }

        // පින්තූරයත් ඇතුළුව requestData එක හදන්න
        const requestData = {
            lng,
            lat,
            requestType,
            issueDescription,
            vehicleDetails,
            damageImage // 👈 අලුතින් එකතු කළා
        };

        const result = await requestService.createServiceRequest(req.user.id, requestData, io);
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
        const io = req.app.get("socketio");

        const result = await requestService.acceptRequest(requestId , providerId, providerType, io)
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

exports.getNearbyRequests = async (req, res) => {
    try {
        const { lng, lat } = req.query;
        const type = req.user.type; // mechanic හෝ garage
        const requests = await requestService.getNearbyPendingRequests(lng, lat, type);
        res.json({ success: true, data: requests });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


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

exports.getProviderStats = async (req, res) => {
    try {
        // req.user.id එකෙන් එන්නේ login වෙලා ඉන්න කෙනාගේ ID එක (User ID)
        const providerId = req.user.id; 
        const stats = await requestService.getProviderTodayStats(providerId);
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { lng, lat } = req.body;
        const io = req.app.get("socketio");

        await requestService.updateProviderLiveLocation(req.user.id, lng, lat, io);

        res.status(200).json({ success: true, message: "Location updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};