import KEYS from './KEYS.js'

$(document).ready(() => {
    let submit = $('.js-searchQuery');
    $('.js-searchQuery-value').keypress((event) => event.which === 13 ? submit.click() : null)
    submit.on('click', searchImages)
    $(".jsAddToFav").on('click', addToFav)
})


function searchImages() {
    const search = $('.js-searchQuery-value').val();
    if (!search) return;

    const endQuery = `&query=${search}&per_page=9&orientation=squarish`;
    const UNSPLASH_API = 'https://api.unsplash.com/search/photos?client_id=' + KEYS.ACCESS_KEY + endQuery;

    //récup donnée stockée en local if hors-ligne
    console.log(navigator.onLine)
    if (!navigator.onLine) {
        console.log("fetch local data")
        localforage.getItem(search).then((data) => {
            console.log(data);
            manageAndDisplayData(data, search);
        });


    } else {
        axios.get(UNSPLASH_API)
            .then(response => {
                // Getting a data object from response that contains the necessary data from the server
                const data = response.data;
                //save search to storage

                localforage.setItem(search, response.data)
                console.log("save data");

                manageAndDisplayData(data, search);

            }).catch(error => console.error('Error while fetching your images', error));
    }
}

function manageAndDisplayData(data, search) {
    let title = '<p>Aucun résultat pour la recherche <span class="font-weight-bold">"' + search + '"</span></p>';
    let images = '';

    if (data.results.length > 0) {
        title = '<p>Voici les résultats de la recherche <span class="font-weight-bold">"' + search + '"</span></p>';

        data.results.map(photo => {
            let url = photo.urls.small;
            let date = new Date(photo.created_at);
            images += '    <div class="col-md-4">\n' +
                '                <div class="card thumbnail mb-4 shadow-sm">\n' +
                '                   <img class="img-fluid" src="' + url + '" alt="' + photo.description + '">\n' +
                '                    <div class="card-body">\n' +
                '                        <p class="card-text ellipsis">' + (photo.description ? photo.description : (photo.alt_description ? photo.alt_description : '')) + '\n' +
                '                        </p>\n' +
                '                        <div class="d-flex justify-content-between align-items-center">\n' +
                '                            <small class="text-muted">' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + '</small>\n' +
                '                            <i class="fas fa-heart" class="jsAddToFav"></i>' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </div>\n'
        })
    }

    $("#js-pwa-photos").html(images)
    $("#js-searchTitle").html(title)
    $('.pwa-spinner').hide();
}

function addToFav() {
    console.log(this)
    console.log(event)
}
