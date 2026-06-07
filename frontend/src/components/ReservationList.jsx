import React from "react";

const ReservationList = ({
  reservations,
  selectedReservationIds,
  onToggleReservationSelection,
  onCancelReservation,
  onOpenUpdateModal
}) => {
  const activeReservations = reservations.filter((reservation) => reservation.status === "active");

  return (
    <section className="panel">
      <div className="panel-title-row">
        <div>
          <h2>Reservations</h2>
          <p>Shows reservation entries and the customer who made each reservation.</p>
        </div>
        <strong>{activeReservations.length} active</strong>
      </div>

      {activeReservations.length === 0 ? (
        <div className="empty-box">No active reservations for this session.</div>
      ) : (
        <div className="reservation-table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Seat</th>
                <th>Customer</th>
                <th>Reservation ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeReservations.map((reservation) => {
                const reservationId = reservation.reservation_id;
                const isSelected = selectedReservationIds.includes(reservationId);

                return (
                  <tr key={reservationId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleReservationSelection(reservationId)}
                      />
                    </td>
                    <td>{reservation.seat_number}</td>
                    <td>{reservation.customer_name}</td>
                    <td className="mono">{reservationId}</td>
                    <td>
                      <span className="status active-status">{reservation.status}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="small-button" onClick={() => onOpenUpdateModal(reservation)}>
                          Update
                        </button>
                        <button className="danger-button" onClick={() => onCancelReservation(reservationId)}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ReservationList;