import Notiflix from "notiflix";
import axios from 'axios';

let BASE_URL = '';
let API_KEY = '';
let searchParams = '';
export let apiService = {};

//https://pixabay.com/api/?key=27773826-7d05f868daf01d5002e50610b&q=yellow+flowers&image_type=photo
//const searchParams = `?key=${Authorization}&q=${query}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`; //отримуємо per_page к-ть

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.url = `${BASE_URL}?${searchParams}`; //  тут path ступної сторінки для нескінченого скрола
  } 
  
  async getPictures() {
    BASE_URL = "https://pixabay.com/api/";
    API_KEY = "27773826-7d05f868daf01d5002e50610b";
    
     searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
       per_page: this.per_page,
       page: this.page,
    
     });
    this.url = `${BASE_URL}?${searchParams}`; //кожен  запит url  записується в this.url
    console.log("this.page до запиту ", this.page);
    console.log("this.url  до запиту", this.url);
     
    try {
      const response = await axios.get(this.url );
      const { data, status } = response;
      if (status !== 200 ) { 
        const myError =  new Error("Sorry, something went wrong.Please try again!");
        Notiflix.Notify.failure(myError);
        return;
      }
      this.page += 1;// сторіка наступного запиту у разі успішного виконання
      console.log("this.page після запиту ", this.page);
      this.url = `${BASE_URL}?${searchParams}`;  //перезібрати url
      console.log("this.url після page +1", this.url);
      return data;
    }
    catch (error) { 
      //console.log(error);
      Notiflix.Notify.failure(error.message);
      };
        
    ////fetch
    // return fetch(`${BASE_URL}?${searchParams}`)
    //   .then(response => {
    //     if (!response.ok) {
    //       Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    //       return;
    //     }
    //     this.page += 1;
    //    console.log("this.page до запиту ", this.page);
    //   return  response.json();
    //   })
    //  .catch(error => {
    //    Notiflix.Notify.failure(error.message);
    //   });
  }
  get query(){
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  resetPage() {
    this.page = 1;
  }

}
