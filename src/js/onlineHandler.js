console.log("hello")
window.addEventListener('online', event => {
    console.log("online")
    updateStatus("online")
});

window.addEventListener('offline', event => {
    console.log("offline")
    updateStatus("offline")
});

function updateStatus(msg) {
    let status = document.getElementById("status");
    let condition = navigator.onLine ? "ONLINE" : "OFFLINE";
    status.setAttribute("class", condition);
    let state = document.getElementById("state");
    state.innerHTML = condition;
    let log = document.getElementById("log");
    log.appendChild(document.createTextNode("Évènement : " + msg + " ; état=" + condition + "\n"));
}

