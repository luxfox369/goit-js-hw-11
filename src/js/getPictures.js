export default getPictures;
import Notiflix from "notiflix";
import axios from 'axios';

//https://pixabay.com/api/?key=27773826-7d05f868daf01d5002e50610b&q=yellow+flowers&image_type=photo
//const searchParams = `?key=${Authorization}&q=${query}&page=${page}&per_page=${per_page}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`; //отримуємо per_page к-ть

function getPictures(query,_page) {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = "27773826-7d05f868daf01d5002e50610b";

  const searchParams = new URLSearchParams({
  key: API_KEY,
  q: query,
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  page:_page,
  per_page: 40,
});
  console.log("рядок запиту ",`${BASE_URL}?${searchParams}`);
   return fetch(`${BASE_URL}?${searchParams}`) 
    .then(response => {
      if (!response.ok) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
      }
      else
        return response.json();
       })
     .catch(error => {
       Notiflix.Notify.failure(error);
      });
}
 