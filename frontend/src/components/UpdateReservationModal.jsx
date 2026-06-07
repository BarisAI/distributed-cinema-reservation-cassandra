import React from "react";
import { seats } from "../data/sampleMovies";

const UpdateReservationModal = ({
  reservation,
  newSeatNumber,
  newCustomerName,
  onNewSeatNumberChange,
  onNewCustomerNameChange,
  onClose,
  onSubmit,
  loading
}) => {
  if (!reservation) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="panel-title-row">
          <div>
            <h2>Update Reservation</h2>
            <p>Update the selected reservation entry in Cassandra.</p>
          </div>
          <button className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="reservation-summary">
          <span>Current Seat: <strong>{reservation.seat_number}</strong></span>
          <span>Current Customer: <strong>{reservation.customer_name}</strong></span>
          <span>ID: <strong>{reservation.reservation_id}</strong></span>
        </div>

        <div className="form-grid">
          <label>
            New Seat Number
            <select
              value={newSeatNumber}
              onChange={(e) => onNewSeatNumberChange(e.target.value)}
            >
              {seats.map((seat) => (
                <option key={seat} value={seat}>
                  {seat}
                </option>
              ))}
            </select>
          </label>

          <label>
            New Customer Name
            <input
              value={newCustomerName}
              onChange={(e) => onNewCustomerNameChange(e.target.value)}
              placeholder="Optional"
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Close
          </button>
          <button className="primary-button" onClick={onSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateReservationModal;