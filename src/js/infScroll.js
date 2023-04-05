import InfiniteScroll from "infinite-scroll";
//import ApiService from "./getPictures"; //клас сервіс пошуку на https://pixabay.com/api
import { apiService } from "./main";
import { refs } from "./refs";
import render from "./main";

export default function onScroll() {
    
    //костиль
    let _url = ""; // для path in infScroll
    let index = apiService.url.indexOf("page=1");
    if (index > -1) _url = `${apiService.url.slice(0, index)}page=2`;
    else _url = apiService.url;

    console.log("_url", _url);
    
    refs.cards = document.querySelectorAll(".photo-card"); // всі photo-card які йдуть в контейнер gallery
    
    let infScroll = new InfiniteScroll('.gallery', {
        // defaults listed
        path: _url,
        // REQUIRED. Determines the URL for the next page
        // Set to selector string to use the href of the next page's link
        // path: '.pagination__next'
        // Or set with {{#}} in place of the page number in the url
        // path: '/blog/page/{{#}}'
        // or set with function
        // path: function() {
        //   return return '/articles/P' + ( ( this.loadCount + 1 ) * 10 );
        // }

        append: refs.cards,
        // REQUIRED for appending content
        // Appends selected elements from loaded page to the container
        //   button:'.load-more',
        // // Enables a button to load pages on click
        //// button: '.load-next-button'
        // responseBody: 'text',
        // Sets the method used on the response.
        // Set to 'json' to load JSON.
        fetchOptions: fetchInfScrloll(),
        // sets custom settings for the fetch() request
        // for setting headers, cors, or POST method
        // can be set to an object, or a function that returns an object
        onInit: function () {
           _url = apiService.url;
        },
        // called on initialization
        // useful for binding events on init
        // onInit: function() {
        //   this.on( 'append', function() {...})
        // }
        
    });
    
    function fetchInfScrloll() {
        {
         const   fetchOption = {
            _url,
         }
            return fetchOption;

            // сторіка наступного запиту 
            // apiService.getPictures().then(data => { render(data); })
            //     .catch(error => { console.log(error) })
           
            // if (apiService.page > Math.ceil(apiService.totalHits / apiService.per_page)) {
            //     refs.pSorry.classList.remove("is-hidden");
            // }
            // return;
        }
        // sets custom settings for the fetch() request
        // for setting headers, cors, or POST method
        // can be set to an object, or a function that returns an object
        
    }
}