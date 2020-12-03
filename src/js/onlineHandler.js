window.addEventListener('online', event => {
    console.log("online")
    updateStatus()

    new Promise(function(resolve, reject) {
        Notification.requestPermission(function(result) {
            if (result !== 'granted') return reject(Error("Denied notification permission"));
            resolve();
        })
    }).then(function() {
        return navigator.serviceWorker.ready;
    }).then(function(reg) {
        return reg.sync.register('syncTest');
    }).then(function() {
        console.log('Sync registered');
    }).catch(function(err) {
        console.log('It broke');
        console.log(err.message);
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
