"use strict";

// import all functions
import { sidebar } from "./sidebar.js";
import { search } from "./search.js";
import { createMovieCard } from "./movie-card.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

// Clear the active genre ID when index.html is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.localStorage.removeItem('activeGenreId');
});

// Function to read movie data from Excel file
async function readMoviesFromExcel() {
  const response = await fetch('assets/data/movies.xlsx');
  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const movies = [];
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let row = range.s.r + 1; row <= range.e.r; row++) { // Start from row 1 to skip headers
    const movie = {
      title: worksheet[XLSX.utils.encode_cell({ c: 0, r: row })]?.v || '',
      genre_names: worksheet[XLSX.utils.encode_cell({ c: 1, r: row })]?.v || '',
      release_date: worksheet[XLSX.utils.encode_cell({ c: 2, r: row })]?.v || '',
      poster_path: worksheet[XLSX.utils.encode_cell({ c: 3, r: row })]?.v || '',
      vote_average: worksheet[XLSX.utils.encode_cell({ c: 4, r: row })]?.v || 0,
      id: worksheet[XLSX.utils.encode_cell({ c: 5, r: row })]?.v || ''
    };
    movies.push(movie);
  }
  return movies;
}

// Function to display movies
async function displayMoviesFromExcel() {
  const movies = await readMoviesFromExcel();
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "我的电影";

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">我的电影</h3>
    </div>

    <div class="grid-list">
    </div>
  `;

  for (const movie of movies) {
    // console.log(movie);
    const movieCard = createMovieCard(movie);
    movieListElem.querySelector(".grid-list").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
}

// Call the function to display movies from Excel
displayMoviesFromExcel();
search();
