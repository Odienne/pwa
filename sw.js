self.addEventListener('install', event => {
    console.log('install')
/*    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                "https://api.unsplash.com/photo",
                "https://images.unsplash.com/photo",
            ]);
        })
    );*/
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
    console.log(event.request.url.includes(search))
    if (event.request.url.includes(search)) {
        console.log("fetch")
        event.respondWith(
            fetch(event.request).then(res => {
                console.log("réponse fetch", res)
                return res;
            })
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
