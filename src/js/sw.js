self.addEventListener('install', event => {
    console.log('install')
    event.waitUntil(Promise.resolve('Install phase succeed'));
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        // la magie opère ici
        (res) => {
            console.log(res)
        }
    );
});