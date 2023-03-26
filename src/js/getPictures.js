import Notiflix from "notiflix";
import axios from 'axios';
//const axios = require('axios');

//https://pixabay.com/api/?key=27773826-7d05f868daf01d5002e50610b&q=yellow+flowers&image_type=photo
//const searchParams = `?key=${Authorization}&q=${query}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`; //отримуємо per_page к-ть

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }  
  async getPictures() {
    const BASE_URL = "https://pixabay.com/api/";
    const API_KEY = "27773826-7d05f868daf01d5002e50610b";
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    });
    // console.log("this.page до запиту ", this.page);

    try {
      const response = await axios.get(`${BASE_URL}?${searchParams}`);
      const { data, status } = response;
      if (status !== 200 ) { 
        const myError =  new Error("Sorry, something went wrong.Please try again!");
        Notiflix.Notify.failure(myError);
        return;
      }
      this.page += 1;
      // console.log("this.page після запиту ", this.page);
      return data;
    }
      catch (error) { 
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
 