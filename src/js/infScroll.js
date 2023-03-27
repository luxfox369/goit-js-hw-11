import InfiniteScroll from "infinite-scroll";
//import ApiService from "./getPictures"; //клас сервіс пошуку на https://pixabay.com/api
import { apiService } from "./main";
import { refs } from "./refs";

export default function onScroll() {
    apiService.page = 2;
    let _url = apiService.url;
    refs.cards = document.querySelectorAll(".photo-card");
    //console.log("apiService.url", apiService.url);
     let infScroll = new InfiniteScroll('.gallery', {
        // defaults listed
        path: apiService.url,
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
            apiService.page = 2;
            _url = apiService.url;
            console.log('з onInit _url'._url);
        },
        // called on initialization
        // useful for binding events on init
        // onInit: function() {
        //   this.on( 'append', function() {...})
        // }
        
    });
    
    function fetchInfScrloll() {
        {
            if (apiService.page > 2) {
                _url = apiService.url;
                return fetch(_url);
            }
            apiService.page += 1;    // сторіка наступного запиту                  
            return apiService;
        }
        // sets custom settings for the fetch() request
        // for setting headers, cors, or POST method
        // can be set to an object, or a function that returns an object
        
    }
} 