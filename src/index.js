import "./css/styles.css";
import Notiflix from "notiflix";
import axios from "axios";

const API_KEY = "35504205-dd2dec5e4a5642491c73dfb42";
const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
let searchQuery = "";
let page = 1;
let totalHits = 0;

const fetchImages = async () => {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  try {
    const response = await axios.get(url);
    const { data } = response;
    totalHits = data.totalHits;
    return data;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure("An error occurred while fetching images. Please try again later.");
    return null;
  }
};

const displayImages = (data) => {
  let images = "";
  data.hits.forEach((image) => {
    const { webformatURL, tags, likes, views, comments, downloads } = image;
    images += `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
        <div class="info">
          <p class="info-item">
            <b>Likes</b>: ${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b>: ${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b>: ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>: ${image.downloads}
          </p>
        </div>
      </div>
    `;
  });
  gallery.insertAdjacentHTML("beforeend", images);
  if (data.hits.length < 40) {
    loadMoreBtn.style.display = "none";
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.style.display = "block";
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value.trim();
  page = 1;
  loadMoreBtn.style.display = "none";
  totalHits = 0;
  gallery.innerHTML = "";
  if (!searchQuery) {
    return;
  }
  const data = await fetchImages();
  if (!data) {
    return;
  }
  if (totalHits === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;
  }
  displayImages(data);
  if (totalHits > 40) {
    loadMoreBtn.style.display = "block";
  }
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  const data = await fetchImages();
  if (!data) {
    return;
  }
  displayImages(data);
  if (gallery.querySelectorAll(".photo-card").length === totalHits) {
    loadMoreBtn.style.display = "none";
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
});