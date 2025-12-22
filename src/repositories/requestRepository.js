const Request = require('../models/Request')

exports.create = (data) =>{
    return Request.create(data);
};

exports.findById = (id) =>{
    return Request.findById(id)
    .populate("customerId" , 'displayName phone')
    .populate("providerId" , 'displayName phone')

};

exports.updateById =(id, data)=>{
    return Request.findByIdAndUpdate(id , data, {new :true});
};

exports.find = (query) => {
    return Request.find(query)
        .populate('customerId', 'displayName phone')
        .populate('providerId', 'displayName phone');
};

exports.findCompletedJobsByProviderToday = (providerId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // කෙලින්ම Mongoose Query එක return කරනවා (Async/Await නැතිව)
    return Request.find({
        providerId: providerId,
        status: 'completed',
        completedAt: { $gte: startOfDay, $lte: endOfDay }
    });
};