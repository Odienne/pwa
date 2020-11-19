window.addEventListener('online', event => {
    console.log("online")
    updateStatus()
});

window.addEventListener('offline', event => {
    console.log("offline")
    updateStatus()
});

function updateStatus() {
    let status = document.getElementById("status");
    let condition = navigator.onLine ? "online" : "offline";
    status.setAttribute("class", condition);
    let state = document.getElementById("state");
    state.innerHTML = condition;
}

