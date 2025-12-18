const Request = require('../models/Request')

exports.create = (data) =>{
    return Request.create(data);
};

exports.findById = (id) =>{
    return Request.findById(id)
    .populate("customerId" , 'displayName phone')
    .populate("providerId" , 'displayName phone')

};

exports.updateById =(id)=>{
    return Request.findByIdAndUpdate(id , data, {new :true});
};

exports.find = (query) => {
    return Request.find(query)
        .populate('customerId', 'displayName phone')
        .populate('providerId', 'displayName phone');
};