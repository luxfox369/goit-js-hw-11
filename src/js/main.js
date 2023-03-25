import "simplelightbox/dist/simple-lightbox.min.css";//звязок з css файлом simplelightbox
import SimpleLightbox from "simplelightbox" //звязок з бібліотекою simplelightbox встановленою через npm install
import "simplelightbox/dist/simple-lightbox.min.css";//звязок з css файлом simplelightbox
import Notiflix from "notiflix";
// import debounce from "lodash.debounce";
import getPictures from "./getPictures";
import  searchParams from "./getPictures";
import refs from "./refs";
export let _page;

// const debouncedInput = debounce(resetScreen, 1000,{leading:true,trailing:false});
// refs.input.addEventListener('input', debouncedInput);

// function resetScreen(e) {
//    const searchQuery = e.target.value.trim();
//   if (searchQuery === "") { 
//     resetGallery(); //якщо користувач очистив input чистимо галерею
//     return;
//   }
  
// };
refs.loadButton.classList.add('is-hidden');
refs.form.addEventListener("submit", onSearch);
 _page = 1;
let query;
function onSearch(event) {
  event.preventDefault();
  const { elements: { searchQuery } } = event.currentTarget;
  query = searchQuery.value.trim();//вміст input = рядок запиту
  //відсилаємо 1-й запит на натиснення кнопки search
  onePage();
}
  function onePage() {
    getPictures(query)
      .then(result => {
        const { totalHits, hits } = result;
        const totalPages = totalHits / 20; // searchParams.per_page;
        if (_page === 1) {
          console.log(" totalPages", totalPages);
          Notiflix.Notify.info(`We have found ${totalHits} photos on your request`);
        }
  //вираховуємо показувати кнопку load more чи ні
  // console.log("_page", _page);
      
  if (totalPages > 1) {
    refs.loadButton.classList.remove('is-hidden');
  }
  if (_page < totalPages) _page += 1;
  else {
    refs.loadButton.classList.add('is-hidden');
    refs.gallery.insertAdjacentHTML("afterend", "<p class='sorry'>We're sorry, but you've reached the end of search results</p>");
    _page = 1;
  }
  //розмічаємо сторіку на основі даних отриманої порції  
  let markUpPage = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
    `<div class="photo-card">
           <a class="gallery__item" href = ${largeImageURL} >
               <img src="${webformatURL}" alt="${tags}" loading="lazy" />
           </a>
                  <div class="info">
                       <p class="info-item">likes:<b>${likes}</b></p>
                       <p class="info-item">views:<b>${views}</b></p>
                       <p class="info-item">comments:<b>${comments}</b></p>
                       <p class="info-item">downloads:<b>${downloads}</b></p>
                   </div>
           
      </div>`)
     .join("");
  //додаємо розмітку порції в DOM       
  refs.gallery.insertAdjacentHTML("beforeend", markUpPage); //рендеримо сторінку
  let gallery = new SimpleLightbox('.gallery div a', { showCounter: false, captionsData: 'alt', captionDelay: 250, });
 })
    .catch(error => { console.log(error.message); }); 
} //кінець onePage


refs.loadButton.addEventListener('click', () => {
  //query = refs.input.value.trim();
  onePage(query);
  
  });

function resetGallery() {
  refs.gallery.innerHTML = "";
}