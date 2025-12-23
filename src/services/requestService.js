const requestRepository = require("../repositories/requestRepository")
const mechanicRepository = require("../repositories/mechanicRepository")
const garageRepository = require("../repositories/garageRepository")
const providerRepository = require('../repositories/providerRepository')
const { getOnlineUsers } = require("../realtime/locationSocket")
const userRepository = require('../repositories/userRepository')



// hellper funtion for provider availability 
const toggleProviderAvailability = async(providerId, requestType , isAvailable) => {

    if(requestType === "mechanic"){
        await mechanicRepository.updateByUserId(providerId, {isAvailable:isAvailable})
    }else if(requestType === "garage"){
        await garageRepository.updateByUserId(providerId, {isAvailable:isAvailable})
    }
}


// create request
// create request
exports.createServiceRequest = async (customerId, data, io) => {

    const requestData = {
        customerId: customerId,
        requestType: data.requestType,
        issueDescription: data.issueDescription,
        vehicleDetails: data.vehicleDetails,
        damageImage : data.damageImage,
        
        location: {
            type: "Point",
            coordinates: [data.lng, data.lat]
        }
    };

    const newRequest = await requestRepository.create(requestData);

    // find near mechanics in 5KM
    const nearProviders = await providerRepository.findNearProviders(
        data.lng,
        data.lat,
        5,
        data.requestType
    );
    
    console.log(`🔍 Nearby ${data.requestType}s Found:`, nearProviders.length);

    const onlineUsers = getOnlineUsers();
    console.log("📱 Currently Online Users in Map:", Array.from(onlineUsers.keys()));

    // සබැඳිව සිටින mechanics/garages වෙත notification යැවීම
    nearProviders.forEach(provider => {
        
        /** * 💡 මෙතැනයි වැරැද්ද තිබුණේ: 
         * provider._id කියන්නේ Garage/Mechanic ID එක. 
         * නමුත් socket එකේ register වෙලා තියෙන්නේ User ID එක.
         */
        const targetUserId = provider.userId._id 
            ? provider.userId._id.toString() 
            : provider.userId.toString();

        const socketId = onlineUsers.get(targetUserId);
        
        console.log(`📡 Attempting to send to User: ${targetUserId} | SocketID: ${socketId}`); 

        if (socketId) {
            io.to(socketId).emit("new_service_request", {
                requestId: newRequest._id,
                customerName: "A customer",
                issue: data.issueDescription,
                distance: "Nearby",
                requestType: data.requestType,
                damageImage: newRequest.damageImage 
            });
            console.log(`✅ Message emitted to socket: ${socketId}`);
        } else {
            console.log(`⚠️ User ${targetUserId} is not online (No SocketID found).`);
        }
    });

    return newRequest;
}

// Accept Request
exports.acceptRequest = async (requestId, providerId, requestType, io) => {
    console.log(`📩 Attempting to accept request: ${requestId} by provider: ${providerId}`);
    
    // 1. මුලින්ම පරීක්ෂා කරන්න මේ Provider (Mechanic/Garage) ඇත්තටම Approved ද කියලා
    let providerProfile;
    if (requestType === "mechanic") {
        providerProfile = await mechanicRepository.getByUserId(providerId);
    } else if (requestType === "garage") {
        providerProfile = await garageRepository.findByUserId(providerId);
    }

    // 🛡️ Validation: Profile එකක් නැත්නම් හෝ Admin Approve කරලා නැත්නම් Error එකක් යවනවා
    if (!providerProfile || providerProfile.verificationStatus !== "approved") {
        throw new Error("Your account is pending approval. You cannot accept requests yet.");
    }

    // 2. Request එක තියෙනවද බලන්න
    const request = await requestRepository.findById(requestId);
    if (!request) {
        throw new Error("Service Request not found.");
    }

    // 3. Request එක තවමත් Pending ද කියලා බලන්න (වෙන අයෙක් අරන් නැති බව තහවුරු කරන්න)
    if (request.status !== "pending" || request.providerId) {
        throw new Error("This request is no longer available.");
    }

    // 4. Request Type එක ගැලපෙනවද බලන්න (Mechanic ට Garage requests බැරි වෙන්න)
    if (request.requestType !== requestType) {
        throw new Error(`This request is only for ${request.requestType}s.`);
    }

    // ✅ සියල්ල නිවැරදි නම් Request එක Update කරන්න
    const updateRequest = await requestRepository.updateById(requestId, {
        status: "accepted",
        providerId: providerId,
        acceptedAt: new Date()
    });

    console.log(`✅ Request ${requestId} status updated to: ACCEPTED`);

    // 5. Provider ව 'Not Available' කරන්න (වැඩේ ඉවර වෙනකම් තව Request එන්නේ නැති වෙන්න)
    await toggleProviderAvailability(providerId, requestType, false);

    // 6. Real-time notification to CUSTOMER
    const onlineUsers = getOnlineUsers();
    const customerSocketId = onlineUsers.get(updateRequest.customerId.toString());

    if (customerSocketId) {
        console.log(`📡 Notifying Customer ${updateRequest.customerId} via socket: ${customerSocketId}`);
        io.to(customerSocketId).emit("request_accepted", {
            requestId: requestId,
            providerId: providerId,
            message: "A provider has accepted your request and is starting the job!"
        });
    } else {
        console.log(`⚠️ Customer ${updateRequest.customerId} is offline.`);
    }

    return updateRequest;
};


// finish request  
exports.completeServiceRequest = async (requestId , providerId,io) =>{
console.log(`🏁 Attempting to complete request: ${requestId}`);
    const request = await requestRepository.findById(requestId);

    if(!request){
        throw new Error("Service Request not found.")
    }

    // chech provider id match to service provider id 
    if(request.providerId._id.toString() !== providerId.toString()){
        throw new Error("You are not authorized to complete this request")
    }

    // update request
    const updateRequest = await requestRepository.updateById(requestId,{
        status: "completed",
        completedAt : new Date()
    })
    console.log(`✅ Request ${requestId} status updated to: COMPLETED`);

    // provider availability again true 
    await toggleProviderAvailability(providerId ,request.requestType, true)

    const onlineUsers = getOnlineUsers();
    const customerSocketId = onlineUsers.get(updateRequest.customerId.toString());

    if (customerSocketId) {
        io.to(customerSocketId).emit("request_completed", {
            requestId: requestId,
            message: "The service is completed. Please rate your experience!"
        });
        console.log("🚀 Completion notification sent to customer.");
    }

    return updateRequest;
}


// for customer get history
exports.getRequestsByUserId = async (userId, userType) => {
    let query = {};

    if (userType === 'customer') {
       
        query = { customerId: userId };
    } else if (userType === 'mechanic' || userType === 'garage') {
      
        query = { providerId: userId };
    } else {
   
        return [];
    }

    return await requestRepository.find(query); 
};

exports.getProviderTodayStats = async (providerId) => {
    // Repository එක call කිරීම (දෙගොල්ලන්ටම පොදුයි)
    const todayJobs = await requestRepository.findCompletedJobsByProviderToday(providerId);
    
    // මෙතැනදී එක් එක් job එකේ 'price' එක database එකේ තියෙනවා නම් ඒක එකතු කරන්න පුළුවන්.
    // දැනට අපි totalEarnings ගණනය කරමු.
    const totalEarnings = todayJobs.reduce((sum, job) => sum + (job.price || 0), 0); 

    return {
        date: new Date().toLocaleDateString(),
        completedJobsCount: todayJobs.length,
        totalEarnings: totalEarnings,
        jobs: todayJobs
    };
};

exports.getNearbyPendingRequests = async (lng, lat, type) => {
    return await requestRepository.findAvailableNearby(lng, lat, 10, type); // 10km ඇතුළත requests
};

// src/services/requestService.js

exports.updateProviderLiveLocation = async (providerId, lng, lat, io) => {
    // 1. User ගේ location එක update කරන්න
    await userRepository.updateByIdLocation(providerId, lng, lat);

    // 2. Repository එක හරහා active request එක හොයන්න
    // කෙලින්ම Request.findOne කියල දාන්න එපා (import කරල නැති නිසා error එනවා)
    const activeRequest = await requestRepository.findActiveRequestByProvider(providerId);

    if (activeRequest) {
        const onlineUsers = getOnlineUsers();
        const customerSocketId = onlineUsers.get(activeRequest.customerId.toString());

        if (customerSocketId) {
            io.to(customerSocketId).emit("live_location_update", {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                requestId: activeRequest._id
            });
            console.log(`📡 Live location sent to customer: ${activeRequest.customerId}`);
        }
    }
};

