/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "./App.css";
import MovieCard from "./components/media/movieCard";

function App() {
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("movie");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:8000/movies/${searchText}`;
        const response = await fetch(url);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchData();
  }, [searchText]);

  const movieList = movies.map((movie) => {
    return (
      <MovieCard
        key={movie.id} // Add a unique key prop
        title={movie.title}
        releaseDate={movie.release_date.slice(0, 4)}
        description={movie.overview}
        posterPath={`https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}`}
        rating={movie.vote_average}
      />
    );
  });

  const handleTypeSelect = (e) => {
    if (e.target.id === "movie") {
      setSearchType("movie");
    }
    if (e.target.id === "tv") {
      setSearchType("tv");
    }
    if (e.target.id === "music") {
      setSearchType("music");
    }
    if (e.target.id === "game") {
      setSearchType("game");
    }
    if (e.target.id === "book") {
      setSearchType("book");
    }
  };

  return (
    <>
      <button
        id="movie"
        style={
          searchType === "movie" ? { color: "yellow" } : { color: "white" }
        }
        onClick={handleTypeSelect}>
        Movies
      </button>
      <button
        id="tv"
        style={searchType === "tv" ? { color: "yellow" } : { color: "white" }}
        onClick={handleTypeSelect}>
        TV
      </button>
      <button
        id="music"
        style={
          searchType === "music" ? { color: "yellow" } : { color: "white" }
        }
        onClick={handleTypeSelect}>
        Music
      </button>
      <button
        id="game"
        style={searchType === "game" ? { color: "yellow" } : { color: "white" }}
        onClick={handleTypeSelect}>
        Games
      </button>
      <button
        id="book"
        style={searchType === "book" ? { color: "yellow" } : { color: "white" }}
        onClick={handleTypeSelect}>
        Books
      </button>
      <br />
      <input
        type="text"
        placeholder={`Enter ${searchType} name`}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {movieList}
    </>
  );
}

export default App;
