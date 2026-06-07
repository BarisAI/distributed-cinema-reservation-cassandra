const ReservationForm = ({
  customerName,
  selectedSeat,
  onCustomerNameChange,
  onSubmit,
  loading
}) => {
  return (
    <section className="panel">
      <h2>Make Reservation</h2>
      <p>Create a new reservation entry in the distributed Cassandra database.</p>

      <div className="form-grid">
        <label>
          Customer Name
          <input
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Example: Baris"
          />
        </label>

        <label>
          Selected Seat
          <input value={selectedSeat || ""} placeholder="Select a seat" disabled />
        </label>
      </div>

      <button className="primary-button" onClick={onSubmit} disabled={loading}>
        {loading ? "Processing..." : "Make Reservation"}
      </button>
    </section>
  );
};

export default ReservationForm;