import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import { Spinner } from "flowbite-react";
import MovieCard from "./components/MovieCard";
import { useDebounce } from 'react-use';
import { updateSearchCount } from "./appwrite.js";
import {  getTrenadingMovies} from  "./appwrite.js";



const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTredingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSerchTerm, setDebounceSerchTerm] = useState("");

  // Debounce faz prevenção de muitas requisição na Api
  useDebounce (() => setDebounceSerchTerm(searchTerm), 500,[searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch Movies");
      }
      const data = await response.json();

      if (data.response === "false") {
        setErrorMessage(data.Error || "failed to fetch Movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error: ${error}`);
      setErrorMessage(`Error fetching Movies; please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

     const loadTrendingMovies = async () => {
      try{
       const movies = await getTrenadingMovies();

       setTredingMovies(movies)
      }catch (error){
       console.error(`Error fetching treding movies ${error}`);
      
      }
     }
     

  useEffect(() => {
    fetchMovies(debounceSerchTerm);
  }, [debounceSerchTerm]);


  useEffect (() => {
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./img/hero.png" alt="hero banner" />
            <h1>
              Encontre <span className="text-gradient">Filmes</span> que você
              vai curtir, sem complicação
            </h1>
          </header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {trendingMovies.length > 0 &&  (
            <section className="trending">
              <h2>Melhores Filmes</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />

                </li>
              ))}
              </ul>
              </section>
          )}


          <section className="all-movies">
            <h2>Todos os Filmes </h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage} </p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                 <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
