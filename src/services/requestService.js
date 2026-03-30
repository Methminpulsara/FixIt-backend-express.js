const requestRepository = require('../repositories/requestRepository');
const mechanicRepository = require('../repositories/mechanicRepository');
const garageRepository = require('../repositories/garageRepository');
const providerRepository = require('../repositories/providerRepository');
const paymentRepository = require('../repositories/paymentRepository');
const { getOnlineUsers } = require('../realtime/locationSocket');
const userRepository = require('../repositories/userRepository');

const toggleProviderAvailability = async (providerId, requestType, isAvailable) => {
  if (requestType === 'mechanic') {
    await mechanicRepository.updateByUserId(providerId, { isAvailable });
  } else if (requestType === 'garage') {
    await garageRepository.updateByUserId(providerId, { isAvailable });
  }
};

exports.createServiceRequest = async (customerId, data, io) => {
  const lng = Number(data.lng);
  const lat = Number(data.lat);
  const searchRadius = Number(data.searchRadius || 5);

  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    throw new Error('Invalid location coordinates.');
  }

  if (Number.isNaN(searchRadius) || searchRadius <= 0) {
    throw new Error('Invalid search radius.');
  }

  const requestData = {
    customerId,
    requestType: data.requestType,
    issueDescription: data.issueDescription,
    vehicleDetails: data.vehicleDetails,
    damageImage: data.damageImage,
    estimatedCost: data.estimatedCost || 0,
    location: {
      type: 'Point',
      coordinates: [lng, lat],
    },
  };

  const newRequest = await requestRepository.create(requestData);

  const nearProviders = await providerRepository.findNearProviders(lng, lat, searchRadius, data.requestType);
  const onlineUsers = getOnlineUsers();

  nearProviders.forEach((provider) => {
    const targetUserId = provider.userId?._id
      ? provider.userId._id.toString()
      : provider.userId.toString();

    const socketId = onlineUsers.get(targetUserId);
    if (socketId) {
      io.to(socketId).emit('new_service_request', {
        requestId: newRequest._id,
        customerName: 'A customer',
        issue: data.issueDescription,
        distance: 'Nearby',
        requestType: data.requestType,
        damageImage: newRequest.damageImage,
      });
    }
  });

  return newRequest;
};

exports.acceptRequest = async (requestId, providerId, requestType, io) => {
  let providerProfile;
  if (requestType === 'mechanic') {
    providerProfile = await mechanicRepository.getByUserId(providerId);
  } else if (requestType === 'garage') {
    providerProfile = await garageRepository.findByUserId(providerId);
  }

  if (!providerProfile || providerProfile.verificationStatus !== 'approved') {
    throw new Error('Your account is pending approval. You cannot accept requests yet.');
  }

  const request = await requestRepository.findById(requestId);
  if (!request) throw new Error('Service Request not found.');

  if (request.status !== 'pending' || request.providerId) {
    throw new Error('This request is no longer available.');
  }

  if (request.requestType !== requestType) {
    throw new Error(`This request is only for ${request.requestType}s.`);
  }

  const updatedRequest = await requestRepository.updateById(requestId, {
    status: 'accepted',
    providerId,
    acceptedAt: new Date(),
  });

  await toggleProviderAvailability(providerId, requestType, false);

  const onlineUsers = getOnlineUsers();
  const customerId = updatedRequest.customerId?._id
    ? updatedRequest.customerId._id.toString()
    : updatedRequest.customerId.toString();
  const customerSocketId = onlineUsers.get(customerId);

  if (customerSocketId) {
    io.to(customerSocketId).emit('request_accepted', {
      requestId,
      providerId,
      message: 'A provider has accepted your request and is starting the job!',
    });
  }

  return updatedRequest;
};

exports.completeServiceRequest = async (requestId, providerId, io, finalAmount = 0) => {
  const request = await requestRepository.findById(requestId);
  if (!request) throw new Error('Service Request not found.');
  if (!request.providerId) throw new Error('This request has no assigned provider.');

  const assignedProviderId = request.providerId._id
    ? request.providerId._id.toString()
    : request.providerId.toString();

  if (assignedProviderId !== providerId.toString()) {
    throw new Error('You are not authorized to complete this request.');
  }

  if (!['accepted', 'in_progress'].includes(request.status)) {
    throw new Error('Only accepted or in-progress requests can be completed.');
  }

  const amount = Number(finalAmount || request.estimatedCost || 0);
  if (Number.isNaN(amount) || amount < 0) {
    throw new Error('Invalid final amount.');
  }

  const updatedRequest = await requestRepository.updateById(requestId, {
    status: 'completed',
    completedAt: new Date(),
    finalAmount: amount,
    paymentStatus: 'pending_cash',
  });

  await toggleProviderAvailability(providerId, request.requestType, true);

  const existingPayment = await paymentRepository.findByRequestId(requestId);
  if (!existingPayment) {
    await paymentRepository.createPayment({
      requestId,
      customerId: request.customerId._id ? request.customerId._id : request.customerId,
      providerId,
      amount,
      method: 'cash',
      status: 'pending',
    });
  }

  const onlineUsers = getOnlineUsers();
  const customerId = updatedRequest.customerId?._id
    ? updatedRequest.customerId._id.toString()
    : updatedRequest.customerId.toString();
  const customerSocketId = onlineUsers.get(customerId);

  if (customerSocketId) {
    io.to(customerSocketId).emit('request_completed', {
      requestId,
      finalAmount: amount,
      paymentStatus: 'pending_cash',
      message: 'The service is completed. Please pay cash and confirm payment in the app.',
    });
  }

  return updatedRequest;
};

exports.getRequestsByUserId = async (userId, userType) => {
  if (userType === 'customer') return requestRepository.find({ customerId: userId });
  if (userType === 'mechanic' || userType === 'garage') return requestRepository.find({ providerId: userId });
  return [];
};

exports.getProviderTodayStats = async (providerId) => {
  const todayJobs = await requestRepository.findCompletedJobsByProviderToday(providerId);
  const totalEarnings = todayJobs.reduce((sum, job) => sum + Number(job.finalAmount || 0), 0);

  return {
    date: new Date().toLocaleDateString(),
    completedJobsCount: todayJobs.length,
    totalEarnings,
    jobs: todayJobs,
  };
};

exports.getNearbyPendingRequests = async (lng, lat, type, radius = 10) => {
  const searchRadius = Number(radius || 10);

  if (Number.isNaN(searchRadius) || searchRadius <= 0) {
    throw new Error('Invalid radius.');
  }

  return requestRepository.findAvailableNearby(lng, lat, searchRadius, type);
};

exports.updateProviderLiveLocation = async (providerId, lng, lat, io) => {
  await userRepository.updateByIdLocation(providerId, lng, lat);

  const activeRequest = await requestRepository.findActiveRequestByProvider(providerId);
  if (activeRequest) {
    const onlineUsers = getOnlineUsers();
    const customerSocketId = onlineUsers.get(activeRequest.customerId.toString());

    if (customerSocketId) {
      io.to(customerSocketId).emit('live_location_update', {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        requestId: activeRequest._id,
      });
    }
  }
};

exports.editServiceRequest = async (customerId, requestId, data, io) => {
  const request = await requestRepository.findById(requestId);
  if (!request) throw new Error('Service Request not found.');

  const requestCustomerId = request.customerId._id
    ? request.customerId._id.toString()
    : request.customerId.toString();

  if (requestCustomerId !== customerId.toString()) {
    throw new Error('You are not authorized to edit this request.');
  }

  if (request.status !== 'pending') {
    throw new Error('Only pending requests can be edited.');
  }

  const updateData = {};

  if (data.requestType) updateData.requestType = data.requestType;
  if (data.issueDescription) updateData.issueDescription = data.issueDescription;
  if (data.vehicleDetails !== undefined) updateData.vehicleDetails = data.vehicleDetails;
  if (data.estimatedCost !== undefined) updateData.estimatedCost = data.estimatedCost;
  if (data.damageImage !== undefined) updateData.damageImage = data.damageImage;

  if (data.lng !== undefined && data.lat !== undefined) {
    const lng = Number(data.lng);
    const lat = Number(data.lat);

    if (Number.isNaN(lng) || Number.isNaN(lat)) {
      throw new Error('Invalid location coordinates.');
    }

    updateData.location = {
      type: 'Point',
      coordinates: [lng, lat],
    };
  }

  const updatedRequest = await requestRepository.updateById(requestId, updateData);

  const searchRadius = Number(data.searchRadius || 5);
  const coords = updatedRequest.location.coordinates;
  const lng = Number(coords[0]);
  const lat = Number(coords[1]);

  const nearProviders = await providerRepository.findNearProviders(
    lng,
    lat,
    searchRadius,
    updatedRequest.requestType
  );

  const onlineUsers = getOnlineUsers();

  nearProviders.forEach((provider) => {
    const targetUserId = provider.userId?._id
      ? provider.userId._id.toString()
      : provider.userId.toString();

    const socketId = onlineUsers.get(targetUserId);
    if (socketId) {
      io.to(socketId).emit('new_service_request', {
        requestId: updatedRequest._id,
        customerName: 'A customer',
        issue: updatedRequest.issueDescription,
        distance: 'Nearby',
        requestType: updatedRequest.requestType,
        damageImage: updatedRequest.damageImage,
      });
    }
  });

  return updatedRequest;
};

exports.cancelServiceRequest = async (customerId, requestId, io) => {
  const request = await requestRepository.findById(requestId);
  if (!request) throw new Error('Service Request not found.');

  const requestCustomerId = request.customerId._id
    ? request.customerId._id.toString()
    : request.customerId.toString();

  if (requestCustomerId !== customerId.toString()) {
    throw new Error('You are not authorized to cancel this request.');
  }

  if (request.status === 'completed' || request.status === 'cancelled') {
    throw new Error('This request cannot be cancelled.');
  }

  if (request.status === 'in_progress') {
    throw new Error('You cannot cancel a request that is already in progress.');
  }

  const updatedRequest = await requestRepository.updateById(requestId, {
    status: 'cancelled',
  });

  if (request.providerId) {
    const providerId = request.providerId._id
      ? request.providerId._id.toString()
      : request.providerId.toString();

    await toggleProviderAvailability(providerId, request.requestType, true);

    const onlineUsers = getOnlineUsers();
    const providerSocketId = onlineUsers.get(providerId);

    if (providerSocketId) {
      io.to(providerSocketId).emit('request_cancelled', {
        requestId,
        message: 'The customer cancelled this request.',
      });
    }
  }

  return updatedRequest;
};