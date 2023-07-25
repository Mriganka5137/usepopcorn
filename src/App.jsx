import { useRef, useState } from "react";
import "./App.css";
import { useEffect } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//Component NAVBAR

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) {
          return;
        }

        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputEl}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function MovieList({ movies, onSelectMovies }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectMovies={onSelectMovies}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovies }) {
  return (
    <li onClick={() => onSelectMovies(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function WatchSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function Loading() {
  return <p className="loader">loading...</p>;
}

function Error({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

// function WatchBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

// Component MAIN
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function MovieDetails({ selectedId, onClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID)?.includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const {
    Poster: poster,
    Actors: actors,
    Director: director,
    Title: title,
    Year: year,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Plot: plot,
    imdbRating,
  } = movie;

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          console.log("CLOSE");
          onClose();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onClose]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
        );

        const data = await res.json();
        setMovie(data);
        // console.log(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  function handleButtonAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      runtime: Number(runtime.split(" ").at(0)),
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      userRatingChoiceCount: countRef.current,
    };

    // console.log(newWatchedMovie);

    onAddWatched(newWatchedMovie);
    onClose();
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        //------------->  The Cleanup function
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className=" btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}{" "}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <StarRating
                  maxRating={10}
                  size={24}
                  onMovieRating={setUserRating}
                />
              ) : (
                <p> You rated this movie with {watchedUserRating}⭐</p>
              )}
            </div>
            {userRating > 0 && (
              <button className="btn-add" onClick={handleButtonAdd}>
                + Add to List
              </button>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Staring: {actors}</p>
            <p>Directed by: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

const API_KEY = "5c9494c7";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  const { movies, isLoading, error } = useMovies(query);

  // const query = "Fuck";

  function handleSelect(id) {
    setSelectedId((selected) => (selected === id ? null : id));
  }

  function handleClose() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <SearchResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {/* {isLoading ? <Loading /> : <MovieList movies={movies} />} */}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovies={handleSelect} />
          )}
          {isLoading && <Loading />}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleClose}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDelete={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
