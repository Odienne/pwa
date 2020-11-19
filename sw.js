self.addEventListener('install', event => {
    console.log('install')
    event.waitUntil(
        caches.open('files').then(function (cache) {
            return cache.addAll([
                "./",
                "./index.html",
                "./src/js/onlineHandler.js",
                "./src/js/main.js",
                "./src/style/index.css",
                "https://unpkg.com/axios/dist/axios.min.js",
                "https://code.jquery.com/jquery-3.5.1.slim.min.js",
                "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js",
                "https://kit.fontawesome.com/b58c61e063.js",
                "./src/js/KEYS.js:",
                "./manifest.webmanifest",
                "./src/images/icons/32x32.ico",
            ]);
        })
    );
});


self.addEventListener('activate', function (event) {
    console.log('Claiming control');
    return self.clients.claim();
});


/*self.addEventListener('fetch', function(event) {
    console.log("fetch")
    console.log(event)
    console.log(event.request)
    event.respondWith(
        caches.match(event.request).catch(function() {
            return fetch(event.request).then(function(response) {
                return caches.open('v1').then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }).catch(function() {
            return caches.match('/route-cas-no-match-no-internet');
        })
    );
});*/


self.addEventListener('fetch', function (event) {
    console.log(event.request.url)

    let search = "https://api.unsplash.com/search";
    if (event.request.url.includes(search)) {
        event.respondWith(
            fetch(event.request).then(res => {
                if (res.status !== 200) {
                    console.log("Error SW fetching");
                    return res;
                }
                return res.json().then((json) => {
                    const formatted = {
                        total: json.total,
                        total_pages: json.total_pages
                    }

                    formatted.results = json.results.map(item => {
                        return {
                            alt_description: item.alt_description,
                            color: item.color,
                            created_at: item.created_at,
                            description: item.description,
                            likes: item.likes,
                            tags: item.tags,
                            links: item.links,
                            urls: item.urls,
                            user: item.user,
                        }
                    })
                    return new Response(JSON.stringify(formatted));
                });
            })
        )
    } else {
        event.respondWith(
            caches.open('files')
                .then(cache => cache.match(event.request))
                .then(function (response) {
                        return response || fetch(event.request);
                    }
                )
        )
    }
    /*
        console.log("fetch")
        console.log(event)
        console.log(event.request)
        let url = event.request.url;
        let search2 = "https://images.unsplash.com/photo";
        if (url.includes(search)) { //mise en cache des photos
            event.respondWith(caches.match(event.request).then(function (response) {
                // caches.match() fonctionne toujours
                // mais en cas de succès, la réponse aura une valeur
                if (response !== undefined) {
                    return response;
                } else {
                    return fetch(event.request).then(function (response) {
                        // la réponse ne peut être utilisée qu'une seule fois
                        // nous devons sauvegarder le clone pour mettre
                        // une copie en cache et servir le second
                        let responseClone = response.clone();

                        caches.open('v1').then(function (cache) {
                            cache.put(event.request, responseClone);
                        });
                        return response;
                    }).catch(function () {
                        return caches.match('test');
                    });
                }
            }));
        }*/
});


self.addEventListener('message', function (event) {
    console.log("message")
    console.log(event)
});
