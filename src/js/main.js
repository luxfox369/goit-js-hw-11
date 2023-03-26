import SimpleLightbox from "simplelightbox" //звязок з бібліотекою simplelightbox встановленою через npm install
import "simplelightbox/dist/simple-lightbox.min.css";//звязок з css файлом simplelightbox
import Notiflix from "notiflix";
import { refs } from "./refs";
import ApiService from "./getPictures"; //клас сервіс пошуку на https://pixabay.com/api

const apiService = new ApiService; //екземпляр класу сервісу

isHiddenBottom(); //доданий клас is-hidden елементам після галереї

refs.form.addEventListener("submit", onSearch);
refs.btnLoadMore.addEventListener('click', moreLoad);



function onSearch(e) { //при натисненні search
  e.preventDefault();  //відміняємо відправку форми
  resetGallery(); //очищаємо розмітку галереї
  isHiddenBottom(); //очищаемо все під галереєю
  apiService.resetPage(); //скидаємо лічильник сторінок сервісі
 const searchValue = e.currentTarget.searchQuery.value.trim(); //відкидаємо пробіли
  if (searchValue) {
    apiService.query = searchValue;//заносимо у властивість query екземпляра  те шо в input.value

    apiService.getPictures().then(data => { //відправляємо запит
      const { totalHits } = data;
     // console.log("data", data);
      if ( totalHits  > 0) render(data); //якщо масив є то  рендеримо
      else Notiflix.Notify.failure("Sorry, there are no images matching to your request. Please try again");
          })
    .catch(error => {Notiflix.Notify.failure(error.message)}) 
  }
  else Notiflix.Notify.info("Please type something for searching!");
}
function moreLoad() {
    apiService.getPictures().then(data => {render(data);})
  
}

function render(data) {
  const { totalHits, hits } = data;
  const groups = Math.ceil(totalHits / apiService.per_page); //округ до найбільшого цілого
  if (groups > 1) {
    refs.btnLoadMore.classList.remove('is-hidden');
  }
  //в сервісі якшо запит виконано успішно то page +=1 для наступного запиту
  if (apiService.page - 1 === 1)
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.It's ${groups} page(s) per ${apiService.per_page} photos on your request`);
  else
    Notiflix.Notify.info(`  ${apiService.page - 1} / ${groups} `);
  
  if (apiService.page > groups && hits.length > 0) {
    refs.btnLoadMore.classList.add('is-hidden');
    refs.pSorry.classList.remove("is-hidden");
  }
  //розмічаємо сторіку на основі реструктуризованих data в кіл-ті <= this.per_page  
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
  //підтягувати фотки вверх коли loadMore
  if (apiService.page > 2) {
  //плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень.
  //Метод firstElementChild.getBoundingClientRect() повертає height  1-го div "photo-card" в gallery
  // та його позицію відносно viewport
  const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
  window.scrollBy({ top: cardHeight * 2, behavior: "smooth", }); //плавно скролить вверх на 2*(height div "photo-card")px
  //Прокручує документ на вказані величини x,y. window.scrollBy(X, Y);
  //or scrollBy(options) 
  //options - a dictionary containing the following parameters:
  //top-specifies the number of pixels along the Y axis to scroll the window or element.
  //left-specifies the number of pixels along the X axis to scroll the window or element.
  //behavior-specifies whether the scrolling should animate smoothly (smooth),
  // happen instantly in a single jump(instant), or let the browser choose (auto, default).
}
  const gallery = new SimpleLightbox('.gallery  a', { captionsData: 'alt', captionDelay: 250, });// showCounter: false,
  gallery.refresh();
}

function resetGallery() {
  refs.gallery.innerHTML = "";
 
}
function isHiddenBottom() {
refs.btnLoadMore.classList.add('is-hidden');
refs.pSorry.classList.add("is-hidden");
}