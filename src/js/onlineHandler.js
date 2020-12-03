window.addEventListener('online', event => {
    console.log("online")
    updateStatus()

    navigator.serviceWorker.ready.then(function(swRegistration) {
        return swRegistration.sync.register('syncTest');
    });
});

window.addEventListener('offline', event => {
    console.log("offline")
    updateStatus()
});

function updateStatus() {
    let status = document.getElementById("status");
    let condition = navigator.onLine ? "online" : "offline";
    status.setAttribute("class", condition);
    status.innerHTML = condition;
}

updateStatus();


// console.log("cc")
// if ("sync" in reg) {
//     const status = await navigator.permissions.query(
//         {
//             name: "background-sync"
//         });
//     if (status == "granted") {
//
//     }
//}
// Utilisation de l’API Background Sync}
