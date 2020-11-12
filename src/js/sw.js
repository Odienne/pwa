self.addEventListener('install', event => {
    console.log('install')
    event.waitUntil(Promise.resolve('Install phase succeed'));
});

self.addEventListener('fetch', function(event) {
    console.log("fetch")
    console.log(event)
});


self.addEventListener('message', function(event) {
    console.log("message")
    console.log(event)
});