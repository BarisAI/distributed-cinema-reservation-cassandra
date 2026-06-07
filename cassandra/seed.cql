USE cinema_reservation;

INSERT INTO reservation_events (
  event_id,
  reservation_id,
  event_type,
  movie_id,
  session_id,
  seat_number,
  customer_name,
  created_at
) VALUES (
  'SYSTEM_INIT_001',
  'SYSTEM',
  'SYSTEM_INITIALIZED',
  'MOVIE_INTERSTELLAR',
  'SESSION_18_00',
  'NONE',
  'SYSTEM',
  toTimestamp(now())
);