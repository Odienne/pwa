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
                "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js",
                // "https://unpkg.com/axios/dist/axios.min.js",
                // "https://code.jquery.com/jquery-3.5.1.slim.min.js",
                // "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js",
                // "./src/js/KEYS.js:",
                // "./manifest.webmanifest",
                // "./src/images/icons/32x32.ico"
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

        /*TODO check offline
            if offline : get data from local database
            if no data for this query : offline message
        */
        if (!navigator.onLine) {
            // On ouvre la base de données
            /*let DBOpenRequest = window.indexedDB.open("images_search_results", 4);

            // On ajoute les deux gestionnaires d'événements
            // qui agissent sur l'objet IDBDatabase object,
            // dans le cas où tout se passe bien ou non
            DBOpenRequest.onerror = function (event) {
                console.log("Erreur lors du chargement de la base de données.");
            };

            DBOpenRequest.onsuccess = function (event) {
                console.log("Base de données initialisée.");

                // On enregistre le résultat de l'ouverture
                // dans la variable db (on l'utilisera plusieurs
                // fois par la suite).
                let db = DBOpenRequest.result;

                // On lance la fonction displayData()
                // afin de remplir la liste de tâches
                // avec les données contenues dans la base
                console.log(db);
                event.respondWith(() => new Response(JSON.stringify(db)));
            };*/
        } else {
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
                        //TODO save data to database
                        console.log("indexDB")
                        if ('indexedDB' in self) {
                            console.log("it has indexDB")

                            localforage.setItem('images_search_results', formatted);
                            console.log('localforaging')
                            /*let DBOpenRequest = self.indexedDB.open("images_search_results", 4);
                            console.log(DBOpenRequest)
                            // Ce gestionnaire permet de parer au cas où une
                            // nouvelle version de la base de données doit
                            // être créée.
                            // Soit la base de données n'existait pas, soit
                            // il faut utiliser une nouvelle version

                            /*DBOpenRequest.onupgradeneeded = function(event) {
                                let db = event.target.result;

                                db.onerror = function(event) {
                                    console.log("Erreur lors du chargement de la base de données.")
                                };

                                // On crée un magasin d'objet objectStore pour
                                // cette base de données via IDBDatabase.createObjectStore

                                let objectStore = db.createObjectStore("images_search_results", { keyPath: "results" });

                                // Enfin, on définit les données qui seront contenues
                                // dans ce modèle de données

                                objectStore.createIndex("alt_description", "alt_description", { unique: false });
                                objectStore.createIndex("color", "color", { unique: false });
                                objectStore.createIndex("created_at", "created_at", { unique: false });
                                objectStore.createIndex("description", "description", { unique: false });
                                objectStore.createIndex("likes", "likes", { unique: false });
                                objectStore.createIndex("tags", "tags", { unique: false });
                                objectStore.createIndex("links", "links", { unique: false });
                                objectStore.createIndex("urls", "urls", { unique: false });

                                console.log("Magasin d'objets créé");
                            };*/

                            //ajout
                            /*DBOpenRequest.onsuccess = function (event) {
                                let db = event.target.result;
                                console.log(db)

                                // let db = DBOpenRequest.result;
                                let transaction = db.transaction(["images_search_results"], "readwrite");

                                // On indique le succès de la transaction
                                transaction.oncomplete = function (event) {
                                    console.log("transaction terminée");
                                };
                                transaction.onerror = function (event) {
                                    console.log("Transaction non ouverte, erreur");
                                };

                                // On crée un magasin d'objet pour la transaction
                                let objectStore = transaction.objectStore("images_search_results");

                                // On ajoute l'objet newItem au magasin d'objets
                                let objectStoreRequest = objectStore.add(formatted);

                                objectStoreRequest.onsuccess = function (event) {
                                    // On indique le succès de l'ajout de l'objet
                                    // dans la base de données
                                    console.log("nouvel élément ajouté en bdd");
                                };
                            }*/

                        }


                        return new Response(JSON.stringify(formatted));
                    });
                })
            )
        }
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
