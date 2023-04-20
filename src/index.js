import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '35504205-dd2dec5e4a5642491c73dfb42';
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', async event => {
  event.preventDefault();
  const searchQuery = event.target.searchQuery.value;

  if (!searchQuery) {
    return;
  }

  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    gallery.innerHTML = '';

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      data.hits.forEach(image => {
        gallery.innerHTML += `
          <div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
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
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
});