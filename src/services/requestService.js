const requestRepository = require("../repositories/requestRepository")
const mechanicRepository = require("../repositories/mechanicRepository")
const garageRepository = require("../repositories/garageRepository")
const providerRepository = require('../repositories/providerRepository')
const { getOnlineUsers } = require("../realtime/locationSocket")




// hellper funtion for provider availability 
const toggleProviderAvailability = async(providerId, requestType , isAvailable) => {

    if(requestType === "mechanic"){
        await mechanicRepository.updateByUserId(providerId, {isAvailable:isAvailable})
    }else if(requestType === "garage"){
        await garageRepository.updateByUserId(providerId, {isAvailable:isAvailable})
    }
}


// create request
exports.createServiceRequest = async (customerId , data  , io) =>{

    const requestData =  {
        customerId: customerId,
        requestType: data.requestType,
        issueDescription: data.issueDescription,
        vehicleDetails:  data.vehicleDetails,
        location:{
            type: "Point",
            coordinates : [data.lng , data.lat]
        }
    };



    const newRequest = await requestRepository.create(requestData)


    // find near mechanics in 5KM
    const nearProviders = await providerRepository.findNearProviders(
        data.lng, 
        data.lat , 
        5,
        data.requestType
    )
    console.log(`🔍 Nearby ${data.requestType}s Found:`, nearProviders.length);

    const onlineUsers = getOnlineUsers();
    console.log("📱 Currently Online Users in Map:", Array.from(onlineUsers.keys()));
    // for send online mechanics send notificatio
    nearProviders.forEach(provider=>{
        const socketId = onlineUsers.get(provider._id.toString());
        console.log(`📡 Sending to: ${provider._id} | SocketID: ${socketId}`); 

        if(socketId){
            io.to(socketId).emit("new_service_request",{
                requestId: newRequest._id,
                customerName: "A customer",
                issue: data.issueDescription,
                distance: "Nerarby",
                requestType:data.requestType
            })
        }
    })
    return newRequest;
}


// Accept Request
exports.acceptRequest =  async (requestId , providerId , requestType , io) =>{
    console.log(`📩 Attempting to accept request: ${requestId} by provider: ${providerId}`);
    
    const request = await requestRepository.findById(requestId);


    if(!request){
        throw new Error ("Service Request not found.");
    }

    // requert ekkent godk yaddi reject krnn
    if(request.status !== "pending" || request.providerId){
        throw new Error ("This request is no longer available.")
    }
    if(request.requestType !== requestType){
          throw new Error (`This request is no longer available For you this is for ${request.requestType}}`)
    }


    // Request ek lock krnn
    const updateRequest = await requestRepository.updateById(requestId,{
        status: "accepted",
        providerId: providerId,
        acceptedAt : new Date()
    });
    console.log(`✅ Request ${requestId} status updated to: ACCEPTED`);

    // accept kalt passe anith provider request reject krnn 
    await toggleProviderAvailability(providerId , requestType, false);


    // Real time notification to CUSTOMER
    const onlineUsers = getOnlineUsers();
    const customerSocketId = onlineUsers.get(updateRequest.customerId.toString())

    if(customerSocketId){
        console.log(`📡 Notifying Customer ${updateRequest.customerId} via socket: ${customerSocketId}`);    
        io.to(customerSocketId).emit("request_accepted",{
            requestId: requestId,
            providerId:providerId,
            message: "A mechanic has accepted your request and is starting the job!"        })
    }else{
        console.log(`⚠️ Customer ${updateRequest.customerId} is offline. Notification not sent.`);
    }   


    return updateRequest;
}



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



