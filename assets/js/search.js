"use strict";

import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = document.querySelector("[search-field]");

  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-modal");
  document.querySelector("main").appendChild(searchResultModal);

  let searchTimeout;

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

  searchField.addEventListener("input", async function () {
    if (!searchField.value.trim()) {
      searchResultModal.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async function () {
      const movies = await readMoviesFromExcel();
      const searchQuery = searchField.value.toLowerCase();
      const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchQuery));

      searchWrapper.classList.remove("searching");
      searchResultModal.classList.add("active");
      searchResultModal.innerHTML = ""; // remove old results

      searchResultModal.innerHTML = `
        <p class="label">Result for</p>
        <h1 class="heading">${searchField.value}</h1>

        <div class="movie-list">
          <div class="grid-list"></div>
        </div>
      `;

      for (const movie of filteredMovies) {
        const movieCard = createMovieCard(movie);
        searchResultModal.querySelector(".grid-list").appendChild(movieCard);
      }
    }, 500);
  });
}
