const requestRepository = require("../repositories/requestRepository")
const mechanicRepository = require("../repositories/mechanicRepository")
const garageRepository = require("../repositories/garageRepository")


// hellper funtion for provider availability 

const toggleProviderAvailability = async(providerId, requestType , isAvailable) => {

    if(requestType === "mechanic"){
        await mechanicRepository.updateByUserId(providerId, {isAvailable:isAvailable})
    }else if(requestType === "garage"){
        await garageRepository.updateByUserId(providerId, {isAvailable:isAvailable})
    }
}


// create request
exports.createServiceRequest = async (customerId , data) =>{

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

    return requestRepository.create(requestData)

}


// Accept Request

exports.acceptRequest =  async (requestId , providerId , requestType ) =>{
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

    // accept kalt passe anith provider request reject krnn 
    await toggleProviderAvailability(providerId , requestType, false);

    return updateRequest;
}
// finish request  
exports.completeServiceRequest = async (requestId , providerId) =>{

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

    // provider availability again true 
    await toggleProviderAvailability(providerId ,request.requestType, true)

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