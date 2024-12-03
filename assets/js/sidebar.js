"use strict";

// Function to fetch genres from an Excel file
async function fetchGenresFromExcel() {
  try {
    const response = await fetch('assets/data/genres.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const genreList = {};
    data.forEach(({ ID, Name }) => {
      genreList[ID] = Name;
    });

    return genreList;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return {};
  }
}

export function sidebar() {
  fetchGenresFromExcel().then(genreList => {
    if (Object.keys(genreList).length === 0) {
      console.error('No genres found');
      return;
    }
    createGenreLinks(genreList);
  });

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">类别</p>
    </div>
    <div class="sidebar-footer">
      <p class="copyright">
        Copyright 2024
        <a>HanLinHK</a>
      </p>
      <img src="./assets/images/ielts-logo.png" width="130" height="17" alt="the movie database logo" />
    </div>
  `;

  function createGenreLinks(genreList) {
    const sidebarList = sidebarInner.querySelector(".sidebar-list");
    const activeGenreId = window.localStorage.getItem("activeGenreId");

    Object.entries(genreList).forEach(([genreId, genreName]) => {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.href = "./movie-list.html";
      link.setAttribute("menu-close", "");
      link.onclick = () => {
        window.localStorage.setItem("activeGenreId", genreId);
        getMovieList(`with_genres=${genreId}`, genreName);
      };
      link.textContent = genreName;

      if (genreId === activeGenreId) {
        link.classList.add("active");
      }

      link.addEventListener("click", function() {
        document.querySelectorAll(".sidebar-link").forEach(link => link.classList.remove("active"));
        this.classList.add("active");
      });

      sidebarList.appendChild(link);
    });

    const sidebarElement = document.querySelector("[sidebar]");
    sidebarElement.appendChild(sidebarInner);
    toggleSidebar(sidebarElement);
  }

  function toggleSidebar(sidebarElement) {
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    const toggleActiveClass = () => {
      sidebarElement.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    };

    sidebarTogglers.forEach(toggler => toggler.addEventListener("click", toggleActiveClass));
    sidebarClose.forEach(close => close.addEventListener("click", () => {
      sidebarElement.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    }));
  }
}
