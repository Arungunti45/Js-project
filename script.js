
const APIKEY = 'api_key=7590720131077890f31b83fa278f35b4';
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';
const HOMEURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&page=1`;

let container = document.getElementById('movie-container');
let search = document.getElementById('searchMovie');
let pBtn = document.getElementById('prev-page');
let nBtn = document.getElementById('next-page');
let pageNumber = 1;


apiCall(HOMEURL);
function apiCall(url) {
    const x = new XMLHttpRequest();
    x.open('GET', url);
    x.send();
    x.onload = function () {
        container.innerHTML = "";
        let res = x.response;
        let conJson = JSON.parse(res);
        if (!conJson.results) {
            console.error("No 'results' in API response. Check the endpoint.");
            return;
        }

        let moviesArray = conJson.results;
        moviesArray.forEach(movie => moviesElement(movie));
    }
}

function moviesElement(movie) {
    let movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <a href="moviePage.html?id=${movie.id}">
                <img src="${IMAGEURL + movie.poster_path}" alt="${movie.title}">
            </a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
                <i class="fas fa-star"></i> ${movie.vote_average}
            </div>
            <div class="add-movie-to-list" id="${movie.id}" onclick="addMovie(${movie.id})">
                <i class="fas fa-plus"></i>
            </div>
        </div>
    `;
    container.appendChild(movieElement);
}

let favMovies = [];
let oldMovies = [];

function addMovie(btnId) {
    document.getElementById(btnId).innerHTML = '<i class="fas fa-check"></i>';

    if (!favMovies.includes(btnId.toString())) {
        favMovies.push(btnId.toString());
    }

    oldMovies = JSON.parse(localStorage.getItem('MovieArray'));
    if (oldMovies == null) {
        localStorage.setItem('MovieArray', JSON.stringify(favMovies));
    } else {
        favMovies.forEach(item => {
            if (!oldMovies.includes(item)) {
                oldMovies.push(item);
            }
        });
        localStorage.setItem('MovieArray', JSON.stringify(oldMovies));
    }
}

search.addEventListener('keyup', function () {
    let input = search.value.trim();
    let inputUrl = `https://api.themoviedb.org/3/search/movie?query=${input}&${APIKEY}`;
    if (input.length !== 0) {
        apiCall(inputUrl);
    } else {
        pageNumber = 1;
        apiCall(HOMEURL);
        disablePBtn();
    }
});

pBtn.disabled = true;

function disablePBtn() {
    pBtn.disabled = (pageNumber === 1);
}

nBtn.addEventListener('click', () => {
    pageNumber++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});

pBtn.addEventListener('click', () => {
    if (pageNumber === 1) return;
    pageNumber--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});
