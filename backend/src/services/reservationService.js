const { client, cassandra } = require("../config/cassandraClient");
const { v4: uuidv4 } = require("uuid");

const getNow = () => new Date();

const createReservation = async ({ movieId, sessionId, seatNumber, customerName }) => {
  const reservationId = uuidv4();
  const now = getNow();

  const insertSeatQuery = `
    INSERT INTO reservations_by_session (
      movie_id,
      session_id,
      seat_number,
      reservation_id,
      customer_name,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    IF NOT EXISTS
  `;

  const insertSeatParams = [
    movieId,
    sessionId,
    seatNumber,
    reservationId,
    customerName,
    "active",
    now,
    now
  ];

  const seatResult = await client.execute(insertSeatQuery, insertSeatParams, { prepare: true });

  if (!seatResult.first()["[applied]"]) {
    return {
      created: false,
      reason: "Seat is already reserved"
    };
  }

  const queries = [
    {
      query: `
        INSERT INTO reservations_by_id (
          reservation_id,
          movie_id,
          session_id,
          seat_number,
          customer_name,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        reservationId,
        movieId,
        sessionId,
        seatNumber,
        customerName,
        "active",
        now,
        now
      ]
    },
    {
      query: `
        INSERT INTO reservations_by_customer (
          customer_name,
          reservation_id,
          movie_id,
          session_id,
          seat_number,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        customerName,
        reservationId,
        movieId,
        sessionId,
        seatNumber,
        "active",
        now,
        now
      ]
    },
    {
      query: `
        INSERT INTO reservation_events (
          event_id,
          reservation_id,
          event_type,
          movie_id,
          session_id,
          seat_number,
          customer_name,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        uuidv4(),
        reservationId,
        "CREATED",
        movieId,
        sessionId,
        seatNumber,
        customerName,
        now
      ]
    }
  ];

  await client.batch(queries, { prepare: true });

  return {
    created: true,
    reservation: {
      reservationId,
      movieId,
      sessionId,
      seatNumber,
      customerName,
      status: "active",
      createdAt: now,
      updatedAt: now
    }
  };
};

const getReservationById = async (reservationId) => {
  const query = `
    SELECT *
    FROM reservations_by_id
    WHERE reservation_id = ?
  `;

  const result = await client.execute(query, [reservationId], { prepare: true });
  return result.first() || null;
};

const getReservationsBySession = async (movieId, sessionId) => {
  const query = `
    SELECT *
    FROM reservations_by_session
    WHERE movie_id = ?
    AND session_id = ?
  `;

  const result = await client.execute(query, [movieId, sessionId], { prepare: true });
  return result.rows;
};

const getReservationsByCustomer = async (customerName) => {
  const query = `
    SELECT *
    FROM reservations_by_customer
    WHERE customer_name = ?
  `;

  const result = await client.execute(query, [customerName], { prepare: true });
  return result.rows;
};

const updateReservation = async (reservationId, { newSeatNumber, customerName }) => {
  const current = await getReservationById(reservationId);

  if (!current) {
    return {
      updated: false,
      reason: "Reservation not found"
    };
  }

  if (current.status !== "active") {
    return {
      updated: false,
      reason: "Only active reservations can be updated"
    };
  }

  const movieId = current.movie_id;
  const sessionId = current.session_id;
  const oldSeatNumber = current.seat_number;
  const oldCustomerName = current.customer_name;
  const finalSeatNumber = newSeatNumber || oldSeatNumber;
  const finalCustomerName = customerName || oldCustomerName;
  const now = getNow();

  if (finalSeatNumber !== oldSeatNumber) {
    const reserveNewSeatQuery = `
      INSERT INTO reservations_by_session (
        movie_id,
        session_id,
        seat_number,
        reservation_id,
        customer_name,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      IF NOT EXISTS
    `;

    const reserveNewSeatParams = [
      movieId,
      sessionId,
      finalSeatNumber,
      reservationId,
      finalCustomerName,
      "active",
      current.created_at,
      now
    ];

    const reserveNewSeatResult = await client.execute(reserveNewSeatQuery, reserveNewSeatParams, { prepare: true });

    if (!reserveNewSeatResult.first()["[applied]"]) {
      return {
        updated: false,
        reason: "New seat is already reserved"
      };
    }

    await client.execute(
      `
        DELETE FROM reservations_by_session
        WHERE movie_id = ?
        AND session_id = ?
        AND seat_number = ?
      `,
      [movieId, sessionId, oldSeatNumber],
      { prepare: true }
    );
  } else {
    await client.execute(
      `
        UPDATE reservations_by_session
        SET customer_name = ?, updated_at = ?
        WHERE movie_id = ?
        AND session_id = ?
        AND seat_number = ?
      `,
      [finalCustomerName, now, movieId, sessionId, oldSeatNumber],
      { prepare: true }
    );
  }

  const queries = [
    {
      query: `
        UPDATE reservations_by_id
        SET seat_number = ?, customer_name = ?, updated_at = ?
        WHERE reservation_id = ?
      `,
      params: [finalSeatNumber, finalCustomerName, now, reservationId]
    },
    {
      query: `
        DELETE FROM reservations_by_customer
        WHERE customer_name = ?
        AND reservation_id = ?
      `,
      params: [oldCustomerName, reservationId]
    },
    {
      query: `
        INSERT INTO reservations_by_customer (
          customer_name,
          reservation_id,
          movie_id,
          session_id,
          seat_number,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        finalCustomerName,
        reservationId,
        movieId,
        sessionId,
        finalSeatNumber,
        "active",
        current.created_at,
        now
      ]
    },
    {
      query: `
        INSERT INTO reservation_events (
          event_id,
          reservation_id,
          event_type,
          movie_id,
          session_id,
          seat_number,
          customer_name,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        uuidv4(),
        reservationId,
        "UPDATED",
        movieId,
        sessionId,
        finalSeatNumber,
        finalCustomerName,
        now
      ]
    }
  ];

  await client.batch(queries, { prepare: true });

  return {
    updated: true,
    reservation: {
      reservationId,
      movieId,
      sessionId,
      seatNumber: finalSeatNumber,
      customerName: finalCustomerName,
      status: "active",
      updatedAt: now
    }
  };
};

const cancelReservation = async (reservationId) => {
  const current = await getReservationById(reservationId);

  if (!current) {
    return {
      cancelled: false,
      reason: "Reservation not found"
    };
  }

  if (current.status !== "active") {
    return {
      cancelled: false,
      reason: "Reservation is already cancelled"
    };
  }

  const now = getNow();

  const queries = [
    {
      query: `
        DELETE FROM reservations_by_session
        WHERE movie_id = ?
        AND session_id = ?
        AND seat_number = ?
      `,
      params: [current.movie_id, current.session_id, current.seat_number]
    },
    {
      query: `
        UPDATE reservations_by_id
        SET status = ?, updated_at = ?
        WHERE reservation_id = ?
      `,
      params: ["cancelled", now, reservationId]
    },
    {
      query: `
        UPDATE reservations_by_customer
        SET status = ?, updated_at = ?
        WHERE customer_name = ?
        AND reservation_id = ?
      `,
      params: ["cancelled", now, current.customer_name, reservationId]
    },
    {
      query: `
        INSERT INTO reservation_events (
          event_id,
          reservation_id,
          event_type,
          movie_id,
          session_id,
          seat_number,
          customer_name,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      params: [
        uuidv4(),
        reservationId,
        "CANCELLED",
        current.movie_id,
        current.session_id,
        current.seat_number,
        current.customer_name,
        now
      ]
    }
  ];

  await client.batch(queries, { prepare: true });

  return {
    cancelled: true,
    reservationId
  };
};

const bulkCancelReservations = async (reservationIds) => {
  const results = [];

  for (const reservationId of reservationIds) {
    const result = await cancelReservation(reservationId);
    results.push({
      reservationId,
      ...result
    });
  }

  return results;
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