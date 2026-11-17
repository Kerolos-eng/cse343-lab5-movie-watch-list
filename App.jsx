import { useEffect, useMemo, useState } from 'react';

const starterMovies = [
  { id: 1, title: 'The Grand Budapest Hotel', year: '2014', genre: 'Comedy · Drama', rating: 5, review: 'A beautifully composed little adventure with a huge heart.' },
  { id: 2, title: 'Spirited Away', year: '2001', genre: 'Animation · Fantasy', rating: 4, review: 'Dreamlike, imaginative, and still magical on every rewatch.' },
];

function Stars({ rating, onChange, label }) {
  return (
    <div className="stars" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          className={`star-button ${star <= rating ? 'is-active' : ''}`}
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function MovieCard({ movie, onRemove, onRatingChange, onReviewChange }) {
  return (
    <article className="movie-card">
      <div className="card-topline">
        <span className="movie-number">#{String(movie.id).padStart(2, '0')}</span>
        <button className="remove-button" type="button" onClick={() => onRemove(movie.id)} aria-label={`Remove ${movie.title}`}>
          Remove
        </button>
      </div>
      <div className="movie-heading">
        <div>
          <h3>{movie.title}</h3>
          <p className="movie-meta">{movie.year} <span>•</span> {movie.genre}</p>
        </div>
        <div className="emoji-rating" title={`${movie.rating} out of 5 stars`}>
          {'⭐'.repeat(movie.rating)}<span className="empty-emojis">{'☆'.repeat(5 - movie.rating)}</span>
        </div>
      </div>
      <div className="review-row">
        <label htmlFor={`review-${movie.id}`}>Your review</label>
        <textarea
          id={`review-${movie.id}`}
          value={movie.review}
          onChange={(event) => onReviewChange(movie.id, event.target.value)}
          placeholder="What did you think?"
          rows="2"
        />
      </div>
      <div className="rating-row">
        <span>Give it a rating</span>
        <Stars rating={movie.rating} onChange={(rating) => onRatingChange(movie.id, rating)} label={`Rating for ${movie.title}`} />
        <strong>{movie.rating}/5</strong>
      </div>
    </article>
  );
}

export default function App() {
  const [movies, setMovies] = useState(() => {
    try {
      const saved = localStorage.getItem('cse343-movies');
      return saved ? JSON.parse(saved) : starterMovies;
    } catch {
      return starterMovies;
    }
  });
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    localStorage.setItem('cse343-movies', JSON.stringify(movies));
  }, [movies]);

  const averageRating = useMemo(() => movies.length ? (movies.reduce((total, movie) => total + movie.rating, 0) / movies.length).toFixed(1) : '0.0', [movies]);

  function addMovie(event) {
    event.preventDefault();
    if (!title.trim()) {
      setNotice('Add a movie title first.');
      return;
    }
    setMovies((current) => [...current, {
      id: Date.now(),
      title: title.trim(),
      year: year.trim() || '—',
      genre: genre.trim() || 'Uncategorized',
      rating: 0,
      review: '',
    }]);
    setTitle('');
    setYear('');
    setGenre('');
    setNotice('Movie added to your watch list.');
  }

  function removeMovie(id) {
    setMovies((current) => current.filter((movie) => movie.id !== id));
    setNotice('Movie removed.');
  }

  function updateMovie(id, key, value) {
    setMovies((current) => current.map((movie) => movie.id === id ? { ...movie, [key]: value } : movie));
  }

  return (
    <main className="app-shell">
      <div className="paper-texture" />
      <header className="site-header">
        <div className="eyebrow"><span className="eyebrow-dot" /> CSE343 · WEB DEVELOPMENT · LAB 05</div>
        <div className="header-row">
          <div>
            <h1>Movie<br /><em>Watch List</em></h1>
            <p className="intro">A cozy corner for films worth remembering,<br />reviewing, and watching again.</p>
          </div>
          <div className="ticket-stub" aria-label="Lab project badge"><span>ADMIT<br />ONE</span><strong>REEL<br />NOTES</strong><small>REACT EDITION</small></div>
        </div>
      </header>

      <section className="stats-strip" aria-label="Watch list summary">
        <div><span>IN THE QUEUE</span><strong>{movies.length}</strong></div>
        <div><span>AVERAGE RATING</span><strong>{averageRating} <small>★</small></strong></div>
        <div><span>FORMAT</span><strong>React <small>↗</small></strong></div>
      </section>

      <section className="content-grid">
        <div className="list-column">
          <div className="section-heading"><div><span className="section-kicker">THE COLLECTION</span><h2>Films on my radar</h2></div><span className="count-pill">{movies.length} {movies.length === 1 ? 'film' : 'films'}</span></div>
          {movies.length > 0 ? (
            <div className="movie-list">
              {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onRemove={removeMovie} onRatingChange={(id, rating) => updateMovie(id, 'rating', rating)} onReviewChange={(id, review) => updateMovie(id, 'review', review)} />)}
            </div>
          ) : <div className="empty-state"><span>🍿</span><h3>Your list is ready for a feature.</h3><p>Add the first movie using the form.</p></div>}
        </div>

        <aside className="add-panel">
          <div className="panel-label">NEW ENTRY <span>✦</span></div>
          <h2>Save a movie<br /><em>for later.</em></h2>
          <p className="panel-copy">Keep your next great watch in one place. You can add a review and rating after watching.</p>
          <form onSubmit={addMovie}>
            <label htmlFor="movie-title">Movie title <span>*</span></label>
            <input id="movie-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. The Godfather" />
            <div className="form-split"><div><label htmlFor="movie-year">Year</label><input id="movie-year" value={year} onChange={(event) => setYear(event.target.value)} placeholder="1972" /></div><div><label htmlFor="movie-genre">Genre</label><input id="movie-genre" value={genre} onChange={(event) => setGenre(event.target.value)} placeholder="Drama" /></div></div>
            <button className="add-button" type="submit">Add to watch list <span>↗</span></button>
          </form>
          <p className="notice" role="status">{notice || 'Your list saves automatically in this browser.'}</p>
          <div className="panel-doodle">✦<br /><span>make<br />time for<br />good stories</span></div>
        </aside>
      </section>
      <footer><span>BUILT WITH REACT + JSX</span><span>LAB 5 / MOVIE WATCH LIST</span><span>✦ KEEP WATCHING</span></footer>
    </main>
  );
}
