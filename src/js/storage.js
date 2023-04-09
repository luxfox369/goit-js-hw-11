import ApiMovie from "./serviseAPI";
import { apiMovie } from "./serviseAPI";
//console.log(apiMovie);
//ключі для сховища
const CURRENT_KEY = "current"; //тут масив зафетчиних фільмів
const WATCHED_KEY = "watched"; //тут масив переглянутих фільмів
const QUEUE_KEY = "queue";     //тут масив фільмів для майьутнього перегляду
const GENRES_KEY = "genres";   //тут масив жанрів
//перетворює value в JSON формат і записує в key locaStorage
const save = (key, value) => {
  try {
    // console.log("from save try")
    const serializedState = JSON.stringify(value); //value перетворює в JSON формат,тобто обгортає всі ключі в ""
    localStorage.setItem(key, serializedState);//в localStorage стіорює пару key зі значенням serializedState
  } catch (error) {
    console.error("Set state error: ", error.message);
  }
};
//витягає з locaStorage key і перетворює в JS 
const load = key => {
  try {
    // console.log("from load try");
    const serializedState = localStorage.getItem(key); //витягає value для key з localStorage
    return serializedState === null ? undefined : JSON.parse(serializedState); //парсить це value в JS обєкт 
  } catch (error) {
    console.error("Get state error: ", error.message);
  }
};
//видаляє key з locaStorage
const remove = key => {
  try {
      return localStorage.removeItem(key); //прибирає значення для key з  localStorage
    } catch (error) {
      console.error("Get state error: ", error.message);
    }
}
//наступний код треба  повставляти в інші файли
//перед load,save,remove ставити storage.

//в index коли submit  разово фетчить і записує масив жанрів в localStorage
function saveGenres() {
    //*******ЖАНРИ******
    //записуємо  масив жанрів в localStorage якщо його ще нема  в  GENRES 
    let arrayGenres = load(GENRES_KEY);//витягуємо з localStorage масив жанрів [{id=12,name="adventure"},{}...]
    if (arrayGenres === [] || !arrayGenres || arrayGenres === {}) {
        apiMovie.fetchGenres()
            .then((data) => {
                const genres = data.genres;
                save(GENRES_KEY, genres);
        
            })
            .catch((error) => console.log(error.message));
    }
}
//saveGenres(); //записуюємо користувачу в localStorage список жанрів
function loadGenres() {
    const arrayGenres = load(GENRES_KEY);
    if (!arrayGenres) {
        saveGenres();
    }
    console.log("from loadGenres",arrayGenres);
    return arrayGenres;
 }
//loadGenres();
// при загрузці сторінки очищуємо current в localStorage  і записуємо масив трендових фільмів заданої сторінки
function saveTrendMovies(page) {
    remove(CURRENT_KEY);
    apiMovie.fetchAllMovie(page)
        .then((data) => {
           // console.log("data from saveTrendMovies page ",page,data.results);
            save(CURRENT_KEY, data.results);
        })
        .catch((error) => console.log(error.message));
}   
//saveTrendMovies(1);
//весь масив сторінки трендових фільмів можна завантажити з current localStorage
function loadTrendMovies() {
    const movies = load(CURRENT_KEY); 
    console.log("from loadTrendMovies",movies);
    return movies;
}   
//loadTrendMovies();

// ****** при ПАГІНАЦІЇ записуємо масив 20 фільмів в localStorage*******

function saveCurrentPage(data) { 
    remove(CURRENT_KEY);
    save(CURRENT_KEY, data); //???data.results
}
//для рендеринга витягаємо масив фільмів з localStorage
function loadCurrentPage() {
    const arrayMovies = load(CURRENT_KEY);
    console.log("from loadCurrentPage",arrayMovies)
    return arrayMovies;
}
//******************** mylibrary *************************
//перевіряємо чи є в списку WATCHED міняємо напис на кнопці
function isWatched(movie,btn){
    const movies = load(WATCHED_KEY);
    if (!movies.includes(movie)) {
         btn.textContent = "ADD to WATCHED";  //чи додавати відповідний клас
    }
     else btn.textContent = "REMOVE FROM WATCHED"; //чи додавати відповідний клас
}
//перевіряємо чи є в списку QUEUE міняємо напис на кнопці
function isQueue(movie,btn) {
    const movies = load(QUEUE_KEY);
    if (!movies.includes(movie)) {
         btn.textContent = "ADD to QUEUE"; //чи додавати відповідний клас
    }
     else btn.textContent = "REMOVE FROM QUEUE"; //чи додавати відповідний клас
}
//const посилання на кнопку = document.querySelector("click", addToWatched)
//при натисненні ADD TO WATCHED додаємо movie в localStorage якщо там його нема
function addToWatched(movie,btn) { //btn це ref на кнопку в модалці фільма,  фільма,яка відповідає за його ознаку WATChED
    const movies = load(WATCHED_KEY);
    if (!movies.includes(movie) && btn.textContent === "ADD TO WATCHED") { //
        movies.push(movie);
        save(WATCHED_KEY,movies);
    } else console.log('Цей фільм вже є в watched або кнопка не add!');
}
//const посилання на кнопку = document.querySelector("click", removeFromWatched) це посилання на addToWatched але перевіряєемо textContent кнопки чи там REMOVE FROM WATCHED
//при натисненні REMOVE FROM WATCHED видаляємо з localStorage якщо він там  є
function removeFromWatched (movie,btn){ //btn це ref на кнопку в модалці  фільма,яка відповідає за його ознаку WATChED
    const movies = load(WATCHED_KEY);
    if (movies.includes(movie) && btn.textContent === "REMOVE FROM WATCHED") {
        movies = movies.filter(({ id }) => id !== movie.id)
        save(WATCHED_KEY, movies);
    } else console.log('Цього фільма нема в watched або кнопка не remove!');
}
// при натисненні на кнопку WATCHED 
//const посилання на кнопку WATCHED = document.querySelector("click", loadFromWatched)
//витягаємо  масив фільмів для рендерінга з localStorage(watched)
function loadFromWatched() {
    const movies = load(WATCHED_KEY);
    return movies;
}
//const посилання на кнопку = document.querySelector("click", addToQueue)
//при натисненні ADD TO QUEUE додаємо в localStorage якщо там його нема
function addToQueue(movie,btn) { //btn це ref на кнопку в модалці  фільма,яка відповідає за його ознаку QUEUE 
    const movies = load(QUEUE_KEY);
    if (!movies.includes(movie) && btn.textContent === "ADD TO QUEUR") {
        movies.push(movie);
        save(QUEUE_KEY,movies);
    } else console.log('Цей фільм вже є в queue або кнопка не add!');
}
//const посилання на кнопку = document.querySelector("click", removeFromQueue) то саме що ADD TO QUEUE
//при натисненні REMOVE FROM QUEUE видаляємо з localStorage якщо він там  є перевіряєемо textContent кнопки чи там REMOVE FROM QUEUE
function removeFromQueue (movie,btn){ //btn це ref на кнопку в модалці фільма, яка відповідає за його ознаку QUEUE
    const movies = load(QUEUE_KEY);
    if (movies.includes(movie) &&  btn.textContent=== "REMOVE FROM QUEUE") {
        movies = movies.filter(({ id }) => id !== movie.id)
        save(QUEUE_KEY, movies);
    } else console.log('Цього фільма нема в queue або кнопка не remove!');
}
///при натисненні кнопки QUEUE витягаємо (треба поилання на кнопку)
//const посилання на кнопку  QUEUE = document.querySelector("click", loadFromQueue)
//витягаємо  масив фільмів для рендерінга з localStorage(queue)
function loadFromQueue() {
    const movies = load(QUEUE_KEY);
    return movies;
}

//виводить на зовні для тих програм ,що мають import  storage from './storage'
//звертатись до  цих функцій так: storage.saveGenres()/storage.loadGenres()......
export default { 
  saveGenres,  //storage.saveGenres() при завнтаженні сторінки функція фетчить масив жанрів і записує в сховище
  loadGenres,  //storage.loadGenres() витягає масив жанрів зі сховища
  saveTrendMovies, //storage.saveTrendMovies(page) зафетчить вказану сторінку трендових фільмів і запише її в сховище
  loadTrendMovies, //storage.loadTrendMovies() для рендерігна  поверне масив трендових фільмів  зі сховища 
  saveCurrentPage, //storage.saveCurrentPage(data)  той хто фетчить той має додати масив фільмів(data) в сховище 
  loadCurrentPage, //storage.loadCurrentPage() хто рендерить текучу сторінку ,той бере масив фільмів зі сховища
  isWatched, //storage.isWatched(movie) перевіряє чи е в списку WATCHED і міняє напис на кпоці ADD TO  WATCHED/REMOVE FROM WATCHED 
  isQueue,  //storage.isQueue(movie)еревіряє чи е в списку QUEUE і міняє напис на кпоці ADD TO QUEUE/REMOVE FROM QUEUE
  addToWatched,  //storage.addToWatched(movie) при натисненні на ADD TO WATCHED  добавляє movie до сховища 
  removeFromWatched, //storage.removeFromWatched(movie) при натисненні на REMOVE FROM WATCHED видаляє movie зі сховища 
  loadFromWatched,   //storage.loadFromWatched() коли натиснули WATCHED використовуємо для рендера сторінки в MyLibrary 
  addToQueue,     //storage.addToQueue(movie) при натисненні на ADD TO QUEUE  добавляє movie до сховища 
  removeFromQueue,  //storage.removeFromQueue(movie) при натисненні на REMOVE FROM QUEUE видаляє movie зі сховища 
  loadFromQueue,   //storage.loadFromQueue() коли натиснули QUEUE використовуємо для рендера сторінки в MyLibrary 
};

