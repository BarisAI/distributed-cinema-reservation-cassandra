const reservationService = require("../services/reservationService");
const responseHelper = require("../utils/responseHelper");

const createReservation = async (req, res) => {
  try {
    const { movieId, sessionId, seatNumber, customerName } = req.body;

    if (!movieId || !sessionId || !seatNumber || !customerName) {
      return responseHelper.error(res, "movieId, sessionId, seatNumber and customerName are required", 400);
    }

    const result = await reservationService.createReservation({
      movieId,
      sessionId,
      seatNumber,
      customerName
    });

    if (!result.created) {
      return responseHelper.error(res, result.reason, 409);
    }

    return responseHelper.success(res, result.reservation, "Reservation created", 201);
  } catch (err) {
    return responseHelper.error(res, "Failed to create reservation", 500, err.message);
  }
};

const getReservationById = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationService.getReservationById(reservationId);

    if (!reservation) {
      return responseHelper.error(res, "Reservation not found", 404);
    }

    return responseHelper.success(res, reservation, "Reservation found");
  } catch (err) {
    return responseHelper.error(res, "Failed to get reservation", 500, err.message);
  }
};

const getReservationsBySession = async (req, res) => {
  try {
    const { movieId, sessionId } = req.params;
    const reservations = await reservationService.getReservationsBySession(movieId, sessionId);

    return responseHelper.success(res, reservations, "Session reservations loaded");
  } catch (err) {
    return responseHelper.error(res, "Failed to get session reservations", 500, err.message);
  }
};

const getReservationsByCustomer = async (req, res) => {
  try {
    const { customerName } = req.params;
    const reservations = await reservationService.getReservationsByCustomer(customerName);

    return responseHelper.success(res, reservations, "Customer reservations loaded");
  } catch (err) {
    return responseHelper.error(res, "Failed to get customer reservations", 500, err.message);
  }
};

const updateReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { newSeatNumber, customerName } = req.body;

    if (!newSeatNumber && !customerName) {
      return responseHelper.error(res, "newSeatNumber or customerName is required", 400);
    }

    const result = await reservationService.updateReservation(reservationId, {
      newSeatNumber,
      customerName
    });

    if (!result.updated) {
      return responseHelper.error(res, result.reason, 409);
    }

    return responseHelper.success(res, result.reservation, "Reservation updated");
  } catch (err) {
    return responseHelper.error(res, "Failed to update reservation", 500, err.message);
  }
};

const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const result = await reservationService.cancelReservation(reservationId);

    if (!result.cancelled) {
      return responseHelper.error(res, result.reason, 409);
    }

    return responseHelper.success(res, result, "Reservation cancelled");
  } catch (err) {
    return responseHelper.error(res, "Failed to cancel reservation", 500, err.message);
  }
};

const bulkCancelReservations = async (req, res) => {
  try {
    const { reservationIds } = req.body;

    if (!Array.isArray(reservationIds) || reservationIds.length === 0) {
      return responseHelper.error(res, "reservationIds must be a non-empty array", 400);
    }

    const results = await reservationService.bulkCancelReservations(reservationIds);

    return responseHelper.success(res, results, "Bulk cancellation completed");
  } catch (err) {
    return responseHelper.error(res, "Failed to bulk cancel reservations", 500, err.message);
  }
};

module.exports = {
  createReservation,
  getReservationById,
  getReservationsBySession,
  getReservationsByCustomer,
  updateReservation,
  cancelReservation,
  bulkCancelReservations
};