const mechanicRepository = require('../repositories/mechanicRepository');
const garageRepository = require('../repositories/garageRepository');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.findPending = () => mechanicRepository.findPending();
exports.findMechanicHistory = () => mechanicRepository.findHistory();
exports.findPendingGarages = () => garageRepository.findPending();
exports.findGarageHistory = () => garageRepository.findHistory();

exports.approveMechanic = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedMechanic = await mechanicRepository.updateVerificationStatus(id, {
      verificationStatus: 'approved',
      isVerified: true,
    }, { session });
    if (!updatedMechanic) throw new Error('Mechanic profile not found.');
    await User.findByIdAndUpdate(updatedMechanic.userId, { isVerified: true }, { session });
    await session.commitTransaction();
    return updatedMechanic;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.rejectMechanic = async (id) => {
  const updatedMechanic = await mechanicRepository.updateVerificationStatus(id, {
    verificationStatus: 'rejected',
    isVerified: false,
  });
  if (!updatedMechanic) throw new Error('Mechanic profile not found.');
  await User.findByIdAndUpdate(updatedMechanic.userId, { isVerified: false });
  return updatedMechanic;
};

exports.approveGarage = async (garageId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedGarage = await garageRepository.updateVerificationStatus(garageId, 'approved', true, { session });
    if (!updatedGarage) throw new Error('Garage profile not found.');
    await User.findByIdAndUpdate(updatedGarage.userId, { isVerified: true }, { session });
    await session.commitTransaction();
    return updatedGarage;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.rejectGarage = async (garageId) => {
  const updatedGarage = await garageRepository.updateVerificationStatus(garageId, 'rejected', false);
  if (!updatedGarage) throw new Error('Garage profile not found.');
  await User.findByIdAndUpdate(updatedGarage.userId, { isVerified: false });
  return updatedGarage;
};
