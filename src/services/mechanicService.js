// const mechanicRepository = require("../repositories/mechanicRepository");

// exports.createMechanicProfile = async (userId, body) => {
//     // 💡 Recommend: Here we should await the creation if we have the 'async' keyword.
//     const newProfile = await mechanicRepository.createProfile({
//         userId,
//         skills: body.skills || [],
//         experience: body.experience || 0,
//         documents: body.documents || {}
//     });
//     return newProfile;
// };

// exports.getMechanicProfile = async (userId) => { // 💡 Add async for consistency
//     return await mechanicRepository.getByUserId(userId); // 💡 Add await
// };

// exports.updateMechanicProfile = async (userId, body) => {
//     // 💡 Add await for better error handling and promise resolution
//     const updated = await mechanicRepository.updateByUserId(userId, {
//         ...body,
//         // When updating, we should reset verification status for re-approval
//         verificationStatus: "pending", 
//         isVerified: false
//     });
//     return updated;
// };

const mechanicRepository = require("../repositories/mechanicRepository");

// --- Mechanic Profile Management ---

exports.createMechanicProfile = async (userId, body) => { 

    const existingProfile = await mechanicRepository.getByUserId(userId);

    if(existingProfile){
        throw new Error("Mechanic profile Already exists !")
    }

    return await mechanicRepository.createProfile({ 
        userId,
        skills: body.skills || [],
        experience: body.experience || 0,
        documents: body.documents || {}
    });
};

exports.getMechanicProfile = async (userId) => { 
    return await mechanicRepository.getByUserId(userId);  
};

exports.updateMechanicProfile = async (userId, body) => { 
    // Update කිරීමේදී Verification Status එක Reset කිරීම
    const updatedData = {
        ...body,
        verificationStatus: "pending", 
        isVerified: false 
    };
    return await mechanicRepository.updateByUserId(userId, updatedData); // 💡 await
};

// // --- Admin Service (Verification) ---
// // (මේවා adminService එකට transfer කළ හැකිය, නමුත් මෙහිදී update කරමු)
// exports.approveMechanic = async (mechanicId) => { // 💡 async
//     const data = { verificationStatus: "approved", isVerified: true };
//     return await mechanicRepository.updateVerificationStatus(mechanicId, data); // 💡 await
// };

// exports.rejectMechanic = async (mechanicId) => { // 💡 async
//     const data = { verificationStatus: "rejected", isVerified: false };
//     return await mechanicRepository.updateVerificationStatus(mechanicId, data); // 💡 await
// };