export default getPictures;
//export { searchParams }  ;
import Notiflix from "notiflix";
import axios from 'axios';
import _page from "./main"

//https://pixabay.com/api/?key=27773826-7d05f868daf01d5002e50610b&q=yellow+flowers&image_type=photo
//const searchParams = `?key=${Authorization}&q=${query}&page=${page}&per_page=${per_page}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`; //отримуємо per_page к-ть

function getPictures(query) {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = "27773826-7d05f868daf01d5002e50610b";
  console.log("inside getPictures _page", _page);
const searchParams = new URLSearchParams({
  key: API_KEY,
  q: query,
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  page:_page,
  per_page: 40,
});
  console.log("запит ",`${BASE_URL}?${searchParams}`);
  return fetch(`${BASE_URL}?${searchParams}`)
    .then(response => {
      if (!response.ok) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
      }
      return response.json();
    })
    .catch(error => {
       console.log(error.message);
       Notiflix.Notify.failure(error.message);
      });
}
 