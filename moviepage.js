const APIKEY = 'api_key=7590720131077890f31b83fa278f35b4';
const BASEURL = 'https://api.themoviedb.org/3';
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';


let id = '';
const urlParams = new URLSearchParams(location.search);
for (const [key, value] of urlParams) {
    id = value;
}


let link = `/movie/${id}?language=en-US&append_to_response=videos&`;
let f_url = `${BASEURL}${link}${APIKEY}`;
apiCall(f_url);

function apiCall(url) {
    const x = new XMLHttpRequest();
    x.open('GET', url);
    x.send();

    x.onload = function () {
        document.getElementById('movie-display').innerHTML = '';
        const res = x.response;
        const Json = JSON.parse(res);
        getMovies(Json);
    };

    x.onerror = function () {
        window.alert('Cannot get movie data');
    };
}


function getMovies(myJson) {
    const MovieTrailer = myJson.videos.results.filter(filterArray);


    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0) 250%), url(${IMAGEURL + myJson.backdrop_path})`;

    const movieDiv = document.createElement('div');
    movieDiv.classList.add('each-movie-page');


    let youtubeURL = '';
    if (MovieTrailer.length > 0) {
        youtubeURL = `https://www.youtube.com/embed/${MovieTrailer[0].key}`;
    } else if (myJson.videos.results.length > 0) {
        youtubeURL = `https://www.youtube.com/embed/${myJson.videos.results[0].key}`;
    }

    movieDiv.innerHTML = `
        <div class="movie-poster">
            <img src="${IMAGEURL + myJson.poster_path}" alt="Poster">
        </div>
        <div class="movie-details">
            <div class="title">${myJson.title}</div>
            <div class="tagline">${myJson.tagline}</div>
            <div style="display: flex;">
                <div class="movie-duration">
                    <b><i class="fas fa-clock"></i></b> ${myJson.runtime} mins
                </div>
                <div class="release-date">
                    <b>Released</b>: ${myJson.release_date}
                </div>
            </div>
            <div class="rating">
                <b>IMDb Rating</b>: ${myJson.vote_average}
            </div>
            <div class="trailer-div" id="trailer-div-btn">
                <i class="fab fa-youtube"></i>
            </div>
            <div id="trailer-video-div" style="display:none;">
                <button id="remove-video-player"><i class="fas fa-times"></i></button>
                <br>
                <span>
                    <iframe width="560" height="315" src="${youtubeURL}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </span>
            </div>
            <div class="plot">${myJson.overview}</div>
        </div>
    `;

    document.getElementById('movie-display').appendChild(movieDiv);


    const youtubeVideo = document.getElementById('trailer-video-div');
    document.getElementById('trailer-div-btn').addEventListener('click', function () {
        youtubeVideo.style.display = 'block';
    });

 
    document.getElementById('remove-video-player').addEventListener('click', function () {
        stopVideo();
        youtubeVideo.style.display = 'none';
    });


    function stopVideo() {
        const iframe = document.querySelector("iframe");
        const url = iframe.getAttribute('src');
        iframe.setAttribute('src', '');
        iframe.setAttribute('src', url);
    }
}


function filterArray(obj) {
    return /Official Trailer/i.test(obj.name);
}
