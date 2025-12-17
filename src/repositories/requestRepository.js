const Request = require('../models/Request')

exports.create = (data) =>{
    return Request.create(data);
};

exports.findById = (id) =>{
    return Request.findById(id)
    .populate("customerId" , 'displayName' , "phone")
    .populate("providerdId" , 'displayName' , "phone")

};


exports.updateById =(id)=>{
    return Request.findByIdAndUpdate(id , data, {new :true});
};
