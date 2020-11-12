self.addEventListener("fetch", event => {
    const requestUrl = new URL(
        event.request.url
    );

// Si la requête est bien celle que l'on
// veut simuler
if (requestUrl.pathname === "/test.html") {
    // Alors, on modifie la réponse
    event.respondWith(
        // Ici je crée une réponse à partir
        // de rien qui contient uniquement
        // "Hello Toto"
        new Response(
            new Blob(
                ["Hello Toto"],
                {type : "text/html"}
            ),
            {
                status: 200,
                statusText: "OK",
                headers: {
                    "Content-Type": "text/html",
                }
            }
        )
    );
}
});