(()=>{function n(){let n=document.getElementById("status"),e=navigator.onLine?"online":"offline";n.setAttribute("class",e),n.innerHTML=e}window.addEventListener("online",(e=>{console.log("online"),n()})),window.addEventListener("offline",(e=>{console.log("offline"),n()})),n()})();