const API_BASE_URL = "http://localhost:5000/api";

const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const createReservation = async (payload) => {
  return request("/reservations", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const getReservationById = async (reservationId) => {
  return request(`/reservations/${reservationId}`);
};

export const getReservationsBySession = async (movieId, sessionId) => {
  return request(`/sessions/${movieId}/${sessionId}/reservations`);
};

export const getReservationsByCustomer = async (customerName) => {
  return request(`/customers/${customerName}/reservations`);
};

export const updateReservation = async (reservationId, payload) => {
  return request(`/reservations/${reservationId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
};

export const cancelReservation = async (reservationId) => {
  return request(`/reservations/${reservationId}`, {
    method: "DELETE"
  });
};

export const bulkCancelReservations = async (reservationIds) => {
  return request("/reservations/bulk-cancel", {
    method: "POST",
    body: JSON.stringify({ reservationIds })
  });
};