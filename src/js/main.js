import KEYS from './KEYS.js'

let favs = [];
$(document).ready(() => {
    let submit = $('.js-searchQuery');
    $('.js-searchQuery-value').keypress((event) => event.which === 13 ? submit.click() : null)
    submit.on('click', searchImages)

    favs = getFavs();

    // navigator.serviceWorker.addEventListener('message', event => {
    //     console.log(event);
    //
    //     let favs = document.querySelectorAll('.fav')
    //     console.log(favs)
    //
    //     fetch("http://localhost:3000/favoris/multiples", {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({favs}),
    //     }).then(res => {
    //         return res.json();
    //     }).then(data => {
    //         favs = data;
    //     })
    // });
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
                '                            <i class="fas fa-heart cursor-pointer ' + (inFav(photo.id) ? "fav" : "not-fav") + ' jsAddToFav" data-search="' + search + '" data-id="' + photo.id + '"></i>' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </div>\n'
        })
    }

    $("#js-pwa-photos").html(images)
    $("#js-searchTitle").html(title)
    $('.pwa-spinner').hide();
    $(".jsAddToFav").on('click', addToFav)

}

function addToFav() {
    console.log(this)
    let photoId = this.dataset.id;
    let searchValue = this.dataset.search;

    let added = !$(this).hasClass('fav')
    $(this).toggleClass('not-fav')
    $(this).toggleClass('fav')

    fetch("http://localhost:3000/favoris", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({photoId}),
    }).then(res => {
        return res.json();
    }).then(data => {
        favs = data;
        let message = added ? "Favori ajouté" : "Favori enlevé";
        sendNotif(message)
    }).catch(error => {
            console.warn("error", error)
            navigator.serviceWorker.ready.then(function (swRegistration) {
                return swRegistration.sync.register('sync-fav');
            });
        }
    )
}

function inFav(id) {
    return favs.includes(id);
}

function getFavs() {
    fetch("http://localhost:3000/favoris", {
        method: 'GET'
    }).then(res => {
        return res.json();
    }).then(data => {
        favs = data;
        return favs;
    })
}

function sendNotif(message) {
    if ('Notification' in window) {
        if (Notification.permission === "granted") {
            const notification =
                new Notification(message)
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission(permission => {
                if (permission === "granted") {
                    const notification =
                        new Notification(message)
                    ;
                }
            });
        }
    }
}
