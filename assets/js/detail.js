"use strict";

import { sidebar } from "./sidebar.js";
import { search } from "./search.js";
const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

// Function to read data from Excel file
const fetchMovieDataFromExcel = async () => {
  try {
    const response = await fetch('assets/data/movies.xlsx');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    return data.find(movie => movie.id === parseInt(movieId));
  } catch (error) {
    console.error('Error fetching or parsing Excel file:', error);
    return null;
  }
};

fetchMovieDataFromExcel().then(movie => {
  if (!movie) {
    console.error('Movie not found in Excel file');
    return;
  }

  const {
    backdrop_path,
    poster_path,
    title,
    release_date,
    runtime,
    vote_average,
    certification,
    genres,
    overview,
    cast,
    directors,
  } = movie;

  document.title = `${title} - TV Movie`;

  const movieDetail = document.createElement("div");
  movieDetail.classList.add("movie-detail");
  const imageBaseURL = "https://image.tmdb.org/t/p/";

  movieDetail.innerHTML = `
    <div
      class="backdrop-image"
      style="background-image: url('${imageBaseURL}w1280${backdrop_path || poster_path}');"></div>

    <figure class="poster-box movie-poster">
      <img
        src="${imageBaseURL}w342${poster_path}"
        alt="${title}"
        class="img-cover"
      />
      <div class="play-overlay">
        <button class="play-button" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: transparent; border: none;">
          <img src="assets/images/play-button.png" alt="Play" style="width: 70px; height: 70px;" />
        </button>
      </div>
    </figure>

    <div class="detail-box">
      <div class="detail-content">
        <h1 class="heading">${title}</h1>

        <div class="meta-list">
          <div class="meta-item">
            <img
              src="./assets/images/star.png"
              width="20"
              height="20"
              alt="rating"
              style="margin-bottom: 5px"
            />
            <span class="span">${vote_average.toFixed(1)}</span>
          </div>

          <div class="separator"></div>
          <div class="meta-item">${runtime}m</div>
          <div class="separator"></div>
          <div class="meta-item">${release_date.split("-")[0]}</div>

          <div class="meta-item card-badge">${certification}</div>
        </div>

        <p class="genre">${genres}</p>

        <p class="overview">${overview}</p>

        <ul class="detail-list">
          <div class="list-item">
            <p class="list-name">演员</p>

            <p>${cast}</p>
          </div>

          <div class="list-item">
            <p class="list-name">导演</p>

            <p>${directors}</p>
          </div>
        </ul>
      </div>

      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    </div>
  `;

  pageContent.appendChild(movieDetail);
});

search();

// Function to create and show the video modal
function showVideoModal(videoUrl) {
  // Create modal elements
  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal-overlay');

  const videoModal = document.createElement('div');
  videoModal.classList.add('video-modal');

  const videoElement = document.createElement('video');
  videoElement.src = videoUrl;
  videoElement.controls = true;
  videoElement.autoplay = true;

  // Create and style the close button
  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.textContent = '✖';
  closeButton.style.fontSize = '35px'; // Make the button bigger
  closeButton.style.position = 'absolute'; // Position it outside the modal
  closeButton.style.top = '0px';
  closeButton.style.right = '30px';

  // Append elements
  videoModal.appendChild(videoElement);
  modalOverlay.appendChild(videoModal);
  document.body.appendChild(modalOverlay);
  document.body.appendChild(closeButton); // Append the close button to the body

  // Event listeners for closing the modal
  closeButton.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  function closeModal() {
    document.body.removeChild(modalOverlay);
    document.body.removeChild(closeButton); // Remove the close button
  }
}

// Event delegation for play button clicks
document.addEventListener("click", (event) => {
  const playButton = event.target.closest(".play-button");
  if (playButton) {
    const videoUrl = "assets/mp4/example.mp4"; // Replace with actual video URL
    showVideoModal(videoUrl);
  }
});
