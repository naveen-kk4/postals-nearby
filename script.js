const ipAddressDiv = document.querySelector(".right>div>h3");
var ipAddress;


$.getJSON("https://api.ipify.org?format=json", function(data) {
   
     ipAddress=data.ip;
    ipAddressDiv.innerHTML=`Your Current IP Address is ${data.ip}`;
    


})

function navigateToNextPage(){
    localStorage.setItem("ipAddress",ipAddress);
    window.location.href = 'details.html';
}