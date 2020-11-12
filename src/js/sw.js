
self.addEventListener("install", event => {
    console.log("install successful")
});

self.addEventListener("fetch", event => {
    console.log("test")
    const requestUrl = new URL(
        event.request.url
    );
});