import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src="./img/search.svg" alt="serach" />

        <input
          type="text"
          placeholder="Pesquise entre milhares de filmes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Search