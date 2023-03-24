import "simplelightbox/dist/simple-lightbox.min.css";//звязок з css файлом simplelightbox
import SimpleLightbox from "simplelightbox" //звязок з бібліотекою simplelightbox встановленою через npm install
import "simplelightbox/dist/simple-lightbox.min.css";//звязок з css файлом simplelightbox
import Notiflix from "notiflix";
import debounce from "lodash.debounce";
import getPictures from "./getPictures";
import refs from "./refs";
let _page = 1;

refs.loadButton.classList.add('is-hidden');
refs.form.addEventListener("submit", onSearch);

const debouncedInput = debounce(resetScreen, 1000,{leading:true,trailing:false});
refs.input.addEventListener('input', debouncedInput);

function resetScreen(e) {
   const searchQuery = e.target.value.trim();
  if (searchQuery === "") { 
    resetGallery(); //якщо користувач очистив input чистимо галерею
    return;
  }
  
};
function onSearch(event) { 
 
  event.preventDefault();
  const { elements: { searchQuery} } = event.currentTarget;
  const query = searchQuery.value.trim();//вміст input = рядок запиту
  
  getPictures(query, _page)
    .then((result) => {
      //console.log("data ", data);
      const totalPages = parseInt(result.totalHits)/ searchParams.per_page;
      console.log("_page", _page);
      console.log(" totalPages", totalPages);
      if (totalPages > 1) {
        refs.loadButton.classList.remove('is-hidden');
      }
      if (_page < totalPages) {
        _page += 1;
      }
      else {
        refs.loadButton.classList.add('is-hidden');
        refs.gallery.insertAdjacentHTML("beforeend", "<p class='sorry'>We're sorry, but you've reached the end of search results</p>");
        _page = 0;
      }
      let markUpPage = result.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
           <a class="gallery__item" href = ${largeImageURL} >
               <img src="${webformatURL}" alt="${tags}" loading="lazy" />
           </a>
                  <div class="info">
                       <p class="info-item"><b>${likes}</b></p>
                       <p class="info-item"><b>${views}</b></p>
                       <p class="info-item"><b>${comments}</b></p>
                       <p class="info-item"><b>${downloads}</b></p>
                   </div>
           
         </div>`)
        .join("");
      refs.gallery.insertAdjacentHTML("beforeend", markUpPage); //рендеримо сторінку
    
      
      })
    .catch(error => { console.log(error.message); }); //Notiflix.Notify.failure
};

//let gallery = new SimpleLightbox('.gallery div a', { showCounter:false,captionsData:'alt' , captionDelay: 250 ,});

refs.loadButton.addEventListener('click', () => {
     onSearch();
  });

function resetGallery() {
  refs.gallery.innerHTML = "";
}