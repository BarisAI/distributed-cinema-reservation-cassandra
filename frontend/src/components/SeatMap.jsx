import { seats } from "../data/sampleMovies";

const SeatMap = ({ reservations, selectedSeat, onSeatSelect }) => {
  const activeReservations = reservations.filter((reservation) => reservation.status === "active");

  const getReservationForSeat = (seatNumber) => {
    return activeReservations.find((reservation) => reservation.seat_number === seatNumber);
  };

  const getSeatClassName = (seatNumber) => {
    const reservation = getReservationForSeat(seatNumber);

    if (reservation) {
      return "seat reserved";
    }

    if (selectedSeat === seatNumber) {
      return "seat selected";
    }

    return "seat available";
  };

  const handleSeatClick = (seatNumber) => {
    const reservation = getReservationForSeat(seatNumber);

    if (reservation) {
      return;
    }

    onSeatSelect(seatNumber);
  };

  return (
    <section className="panel">
      <div className="panel-title-row">
        <div>
          <h2>Seat Map</h2>
          <p>Available seats can be selected. Reserved seats are locked by Cassandra.</p>
        </div>
        <div className="legend">
          <span><i className="legend-box available-box"></i>Available</span>
          <span><i className="legend-box selected-box"></i>Selected</span>
          <span><i className="legend-box reserved-box"></i>Reserved</span>
        </div>
      </div>

      <div className="screen">SCREEN</div>

      <div className="seat-map">
        {seats.map((seatNumber) => {
          const reservation = getReservationForSeat(seatNumber);

          return (
            <button
              key={seatNumber}
              className={getSeatClassName(seatNumber)}
              onClick={() => handleSeatClick(seatNumber)}
              title={reservation ? `Reserved by ${reservation.customer_name}` : "Available"}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default SeatMap;