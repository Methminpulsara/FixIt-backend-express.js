
const requestService = require('../services/requestService')


// customer => create service request 
exports.createRequest = async(req, res) => {

    try {
        if(req.user,type !== "customer"){
            return res.status(403).json({message: "Only customers can create request"})
        }

        // if have reqired fileds in bod 
        const {lng , lat , requestType , issueDescription  } = req.body;
        if(!lng || !lat || !requestType  || !issueDescription){
            res.status(400).json({message: "Missing required details"});
        }

        const result = await requestService.createServiceRequest(req.user.id , req.body)
        res.status(201).json({success:true , result:result})  
    } catch (error) {
        res.status(400).json({messgae:error.messgae})
        
    }

}

exports.createRequest = async(req, res) => {
    
}