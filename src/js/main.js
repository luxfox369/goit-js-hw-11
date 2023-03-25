import "simplelightbox/dist/simple-lightbox.min.css";//звязок з css файлом simplelightbox
import SimpleLightbox from "simplelightbox" //звязок з бібліотекою simplelightbox встановленою через npm install
import "simplelightbox/dist/simple-lightbox.min.css";//звязок з css файлом simplelightbox
import Notiflix from "notiflix";
import { refs } from "./refs";
import ApiService from "./getPictures";

const apiService = new ApiService;

isHiddenBottom(); //доданий клас is-hidden

refs.form.addEventListener("submit", onSearch);
refs.btnLoadMore.addEventListener('click', moreLoad);

function onSearch(e) { //при натисненні search
  e.preventDefault();  //відміняємо відправку форми
  resetGallery(); //очищаємо розмітку
  isHiddenBottom();
  apiService.resetPage(); //скидаємо лічильник сторінок сервісі
 const searchValue = e.currentTarget.searchQuery.value.trim();
  if (searchValue) {
    apiService.query = searchValue;//query = input.value
    apiService.getPictures().then(result => {
      if (result.total > 0) render(result); //якщо масив є то fetch img отриманий результат рендеримо
      else Notiflix.Notify.info("NO images in stories matching to your request. Please try again");
      })
    .catch(error => {Notiflix.Notify.failure(error.message)}) 
  }
  else Notiflix.Notify.info("Please type something for searching!");
}
function moreLoad() {
   apiService.getPictures().then(data => {render(data);})
}

function render(result) {
  const { totalHits, hits } = result;

  const groups = Math.ceil(totalHits / apiService.per_page); //округ до найбільшого цілого
  if (groups > 1) {
    refs.btnLoadMore.classList.remove('is-hidden');
  }
 //в сервісі якшо запит виконано  то page +=1 для наступного запиту
   if (apiService.page-1 === 1 )  
  Notiflix.Notify.info(`We have found ${totalHits} items  that are ${groups} page(s) of photos on your request`);
   else
  Notiflix.Notify.info(`*** it's  ${apiService.page - 1} / ${groups} ***`);  
  
  if (apiService.page > groups && hits.length>0){
    refs.btnLoadMore.classList.add('is-hidden');
    refs.pSorry.classList.remove("is-hidden");
    }
  //розмічаємо сторіку на основі даних отриманої порції  
  let markUpPage = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
    `<div class="photo-card">
           <a class="gallery__item" href = ${largeImageURL} >
               <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
           </a>
                <div class="info">
                       <p class="info-item">likes-<b>${likes}</b></p>
                       <p class="info-item">views-<b>${views}</b></p>
                       <p class="info-item">comments-<b>${comments}</b></p>
                       <p class="info-item">downloads-<b>${downloads}</b></p>
                </div>
           
      </div>`)
     .join("");
  //додаємо розмітку порції в DOM       
  refs.gallery.insertAdjacentHTML("beforeend", markUpPage); //рендеримо сторінку
  let gallery = new SimpleLightbox('.gallery div a', { showCounter: false, captionsData: 'alt', captionDelay: 250, });
}

function resetGallery() {
  refs.gallery.innerHTML = "";
 
}
function isHiddenBottom() {
refs.btnLoadMore.classList.add('is-hidden');
refs.pSorry.classList.add("is-hidden");
}