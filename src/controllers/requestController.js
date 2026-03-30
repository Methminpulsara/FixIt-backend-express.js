const requestService = require('../services/requestService');

exports.createRequest = async (req, res) => {
  try {
    const io = req.app.get('socketio');
    const damageImage = req.file ? `/uploads/${req.file.filename}` : null;

    const { lng, lat, requestType, issueDescription, vehicleDetails, estimatedCost, searchRadius } = req.body;

    if (!lng || !lat || !requestType || !issueDescription) {
      return res.status(400).json({ message: 'Missing required details.' });
    }

    const requestData = {
      lng,
      lat,
      requestType,
      issueDescription,
      vehicleDetails,
      estimatedCost,
      searchRadius,
      damageImage,
    };

    const result = await requestService.createServiceRequest(req.user.id, requestData, io);
    res.status(201).json({ success: true, request: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const providerType = req.user.type;
    if (providerType !== 'mechanic' && providerType !== 'garage') {
      return res.status(403).json({ message: 'Access denied. Only service providers can accept requests.' });
    }

    const requestId = req.params.id;
    const providerId = req.user.id;
    const io = req.app.get('socketio');

    const result = await requestService.acceptRequest(requestId, providerId, providerType, io);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.completeRequest = async (req, res) => {
  try {
    const providerType = req.user.type;
    if (providerType !== 'mechanic' && providerType !== 'garage') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const requestId = req.params.id;
    const providerId = req.user.id;
    const io = req.app.get('socketio');
    const { finalAmount } = req.body;

    const result = await requestService.completeServiceRequest(requestId, providerId, io, finalAmount);
    res.json({ success: true, request: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getNearbyRequests = async (req, res) => {
  try {
    const { lng, lat, radius } = req.query;
    const type = req.user.type;
    const requests = await requestService.getNearbyPendingRequests(lng, lat, type, radius);
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
};

exports.getProviderStats = async (req, res) => {
  try {
    const providerId = req.user.id;
    const stats = await requestService.getProviderTodayStats(providerId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { lng, lat } = req.body;
    const io = req.app.get('socketio');

    await requestService.updateProviderLiveLocation(req.user.id, lng, lat, io);

    res.status(200).json({ success: true, message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const io = req.app.get('socketio');
    const damageImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const result = await requestService.editServiceRequest(req.user.id, requestId, {
      ...req.body,
      damageImage,
    }, io);

    res.status(200).json({ success: true, request: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const io = req.app.get('socketio');

    const result = await requestService.cancelServiceRequest(req.user.id, requestId, io);
    res.status(200).json({ success: true, request: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
