import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '35504205-dd2dec5e4a5642491c73dfb42';
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
let searchQuery = '';
let page = 1;
let totalHits = 0;
let isFetchingImages = false;
const lightbox = new SimpleLightbox('.photo-card a');

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
    Notiflix.Notify.info("Or maybe you've reached the end of the search results.");
    return null;
  }
};

const displayImages = data => {
  let images = '';
  data.hits.forEach(image => {
    const { webformatURL, tags, likes, views, comments, downloads } = image;
    images += `
      <div class="photo-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
        </a>
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
  isFetchingImages = false;
  lightbox.refresh();
  if (data.hits.length < 40) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
};

form.addEventListener("submit", async e => {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value.trim();
  page = 1;
  totalHits = 0;
  gallery.innerHTML = '';
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
  Notiflix.Notify.success("Hooray! We found ${totalHits} images.");

});

const loadMore = async (entries, observer) => {
  entries.forEach(async entry => {
    if (entry.isIntersecting && !isFetchingImages && gallery.querySelectorAll('.photo-card').length !== totalHits)
    {
      isFetchingImages = true;
      page += 1;
      const data = await fetchImages();
      if (!data) {
        return;
      }
      displayImages(data);
    }
  });
};

const observer = new IntersectionObserver(loadMore, { threshold: 1 });
observer.observe(document.querySelector('.load-more'));