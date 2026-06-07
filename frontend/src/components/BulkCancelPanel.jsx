const BulkCancelPanel = ({ selectedReservationIds, onBulkCancel, onClearSelection, loading }) => {
  return (
    <section className="panel">
      <h2>Bulk Cancellation</h2>
      <p>Cancel more than one reservation at the same time. This is required for pair projects.</p>

      <div className="bulk-box">
        <div>
          <span>Selected Reservations</span>
          <strong>{selectedReservationIds.length}</strong>
        </div>

        <div className="bulk-actions">
          <button className="secondary-button" onClick={onClearSelection}>
            Clear Selection
          </button>
          <button
            className="danger-button large"
            onClick={onBulkCancel}
            disabled={selectedReservationIds.length === 0 || loading}
          >
            {loading ? "Cancelling..." : "Cancel Selected"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BulkCancelPanel;