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
    console.log(condition)
    status.setAttribute("class", condition);
    status.innerHTML = condition;
}

updateStatus();

