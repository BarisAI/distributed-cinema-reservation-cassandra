import { useEffect, useMemo, useState } from "react";
import MovieSessionSelector from "../components/MovieSessionSelector";
import SeatMap from "../components/SeatMap";
import ReservationForm from "../components/ReservationForm";
import ReservationList from "../components/ReservationList";
import UpdateReservationModal from "../components/UpdateReservationModal";
import BulkCancelPanel from "../components/BulkCancelPanel";
import StatusMessage from "../components/StatusMessage";
import { movies } from "../data/sampleMovies";
import {
  createReservation,
  getReservationsBySession,
  updateReservation,
  cancelReservation,
  bulkCancelReservations
} from "../api/reservationApi";

const ReservationPage = () => {
  const defaultMovie = movies[0];
  const defaultSession = defaultMovie.sessions[0];

  const [selectedMovieId, setSelectedMovieId] = useState(defaultMovie.id);
  const [selectedSessionId, setSelectedSessionId] = useState(defaultSession.id);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [reservations, setReservations] = useState([]);
  const [selectedReservationIds, setSelectedReservationIds] = useState([]);
  const [updateModalReservation, setUpdateModalReservation] = useState(null);
  const [newSeatNumber, setNewSeatNumber] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [loading, setLoading] = useState(false);

  const selectedMovie = useMemo(() => {
    return movies.find((movie) => movie.id === selectedMovieId) || movies[0];
  }, [selectedMovieId]);

  const showMessage = (message, type = "success") => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const loadReservations = async () => {
    try {
      const response = await getReservationsBySession(selectedMovieId, selectedSessionId);
      setReservations(response.data || []);
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleMovieChange = (movieId) => {
    const movie = movies.find((item) => item.id === movieId);
    setSelectedMovieId(movieId);
    setSelectedSessionId(movie.sessions[0].id);
    setSelectedSeat("");
    setSelectedReservationIds([]);
  };

  const handleSessionChange = (sessionId) => {
    setSelectedSessionId(sessionId);
    setSelectedSeat("");
    setSelectedReservationIds([]);
  };

  const handleCreateReservation = async () => {
    if (!customerName.trim()) {
      showMessage("Customer name is required", "error");
      return;
    }

    if (!selectedSeat) {
      showMessage("Please select an available seat", "error");
      return;
    }

    try {
      setLoading(true);

      await createReservation({
        movieId: selectedMovieId,
        sessionId: selectedSessionId,
        seatNumber: selectedSeat,
        customerName: customerName.trim()
      });

      setSelectedSeat("");
      setCustomerName("");
      showMessage("Reservation created successfully");
      await loadReservations();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      setLoading(true);
      await cancelReservation(reservationId);
      setSelectedReservationIds((current) => current.filter((id) => id !== reservationId));
      showMessage("Reservation cancelled successfully");
      await loadReservations();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCancel = async () => {
    try {
      setLoading(true);
      await bulkCancelReservations(selectedReservationIds);
      setSelectedReservationIds([]);
      showMessage("Bulk cancellation completed successfully");
      await loadReservations();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateModal = (reservation) => {
    setUpdateModalReservation(reservation);
    setNewSeatNumber(reservation.seat_number);
    setNewCustomerName(reservation.customer_name);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalReservation(null);
    setNewSeatNumber("");
    setNewCustomerName("");
  };

  const handleUpdateReservation = async () => {
    if (!updateModalReservation) {
      return;
    }

    if (!newSeatNumber.trim() && !newCustomerName.trim()) {
      showMessage("New seat number or customer name is required", "error");
      return;
    }

    try {
      setLoading(true);

      await updateReservation(updateModalReservation.reservation_id, {
        newSeatNumber: newSeatNumber.trim().toUpperCase(),
        customerName: newCustomerName.trim()
      });

      handleCloseUpdateModal();
      showMessage("Reservation updated successfully");
      await loadReservations();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReservationSelection = (reservationId) => {
    setSelectedReservationIds((current) => {
      if (current.includes(reservationId)) {
        return current.filter((id) => id !== reservationId);
      }

      return [...current, reservationId];
    });
  };

  useEffect(() => {
    loadReservations();
  }, [selectedMovieId, selectedSessionId]);

  return (
    <main className="page-layout">
      <StatusMessage message={statusMessage} type={statusType} />

      <MovieSessionSelector
        selectedMovieId={selectedMovieId}
        selectedSessionId={selectedSessionId}
        onMovieChange={handleMovieChange}
        onSessionChange={handleSessionChange}
        onRefresh={loadReservations}
      />

      <div className="selected-session-card">
        <span>Current Session</span>
        <strong>{selectedMovie.title} · {selectedMovie.sessions.find((session) => session.id === selectedSessionId)?.label}</strong>
      </div>

      <div className="main-grid">
        <div>
          <SeatMap
            reservations={reservations}
            selectedSeat={selectedSeat}
            onSeatSelect={setSelectedSeat}
          />

          <ReservationForm
            customerName={customerName}
            selectedSeat={selectedSeat}
            onCustomerNameChange={setCustomerName}
            onSubmit={handleCreateReservation}
            loading={loading}
          />
        </div>

        <div>
          <ReservationList
            reservations={reservations}
            selectedReservationIds={selectedReservationIds}
            onToggleReservationSelection={handleToggleReservationSelection}
            onCancelReservation={handleCancelReservation}
            onOpenUpdateModal={handleOpenUpdateModal}
          />

          <BulkCancelPanel
            selectedReservationIds={selectedReservationIds}
            onBulkCancel={handleBulkCancel}
            onClearSelection={() => setSelectedReservationIds([])}
            loading={loading}
          />
        </div>
      </div>

      <UpdateReservationModal
        reservation={updateModalReservation}
        newSeatNumber={newSeatNumber}
        newCustomerName={newCustomerName}
        onNewSeatNumberChange={setNewSeatNumber}
        onNewCustomerNameChange={setNewCustomerName}
        onClose={handleCloseUpdateModal}
        onSubmit={handleUpdateReservation}
        loading={loading}
      />
    </main>
  );
};

export default ReservationPage;