self.addEventListener('install', event => {
    event.waitUntil(Promise.resolve('Install phase succeed'));
});

selfg.addEventListener('fetch', function(event) {
    event.respondWith(
        // la magie opère ici
        console.log("test")
    );
});