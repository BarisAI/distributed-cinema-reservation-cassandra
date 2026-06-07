import { movies } from "../data/sampleMovies";

const MovieSessionSelector = ({
  selectedMovieId,
  selectedSessionId,
  onMovieChange,
  onSessionChange,
  onRefresh
}) => {
  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId);

  return (
    <section className="panel">
      <div className="panel-title-row">
        <div>
          <h2>Movie and Session</h2>
          <p>Select a movie session to browse and manage reservations.</p>
        </div>
        <button className="secondary-button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <div className="form-grid">
        <label>
          Movie
          <select value={selectedMovieId} onChange={(e) => onMovieChange(e.target.value)}>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Session
          <select value={selectedSessionId} onChange={(e) => onSessionChange(e.target.value)}>
            {selectedMovie.sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
};

export default MovieSessionSelector;