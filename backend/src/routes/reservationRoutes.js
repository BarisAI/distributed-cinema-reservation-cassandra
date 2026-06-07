const express = require("express");
const reservationController = require("../controllers/reservationController");

const router = express.Router();

router.post("/reservations", reservationController.createReservation);
router.get("/reservations/:reservationId", reservationController.getReservationById);
router.put("/reservations/:reservationId", reservationController.updateReservation);
router.delete("/reservations/:reservationId", reservationController.cancelReservation);
router.post("/reservations/bulk-cancel", reservationController.bulkCancelReservations);
router.get("/sessions/:movieId/:sessionId/reservations", reservationController.getReservationsBySession);
router.get("/customers/:customerName/reservations", reservationController.getReservationsByCustomer);

module.exports = router;