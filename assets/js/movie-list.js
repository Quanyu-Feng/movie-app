"use strict";

import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { sidebar } from "./sidebar.js";

// collect genre, name & url parameter from local storage
const genreName = window.localStorage.getItem("genreName");
const pageContent = document.querySelector("[page-content]");

sidebar();

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

// Function to display movies based on genre
async function displayMoviesByGenre() {
  const movies = await readMoviesFromExcel();
  const filteredMovies = movies.filter(movie => movie.genre_names.includes(genreName));

  document.title = `${genreName} - TV Movie`;

  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list", "genre-list");
  movieListElem.ariaLabel = `${genreName} Movies`;

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h1 class="heading">全部${genreName}电影</h1>
    </div>

    <div class="grid-list"></div>
  `;

  for (const movie of filteredMovies) {
    const movieCard = createMovieCard(movie);
    movieListElem.querySelector(".grid-list").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
}

// Call the function to display movies by genre
displayMoviesByGenre();

search();