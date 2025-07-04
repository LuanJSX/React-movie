import React, { useEffect, useState } from "react";
import Search from "./components/Search";

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
  const [isLoading, setIsLoading] = useState(false);


  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint,API_OPTIONS)
      
      if(!response.ok) {
        throw new Error('Failed to fetch Movies')
      }
      const data = await response.json();
      
      if (data.response === 'false') {
        setErrorMessage(data.Error || "failed to fetch Movies");
        setMovieList([]);
        return;
      }
     
 
       setMovieList(data.results || []);
  
    } catch (error) {
      console.error(`Error: ${error}`);
      setErrorMessage(`Error fetching Movies; please try again later.`);
    } finally{
          setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

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
          <section className="all-movies">
            <h2>Todos os filmes </h2>

            {isLoading ? (
              <p className="text-white">loading...</p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage} </p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <p key={movie.id} className="text-white">
                    {movie.title}
                  </p>
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
