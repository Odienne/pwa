self.addEventListener('install', event => {
    console.log('install')
    event.waitUntil(Promise.resolve('Install phase succeed'));
});

self.addEventListener('activate', function(event) {
    console.log('Claiming control');
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    console.log("fetch")
    console.log(event)
    console.log(event.request)
});


self.addEventListener('message', function(event) {
    console.log("message")
    console.log(event)
});
