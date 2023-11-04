const ipAddress = document.querySelector("header>p");
const details = document.querySelectorAll(".location-details>p");
const moreDetails = document.querySelectorAll(".more-info>div>p");
const post_office_Div = document.querySelector(".post-offices");
const search_input = document.getElementById("search-input");

let map;
let post_offices = [];
let timer;




// first function that is being invoked on page load
//this function fills all details on the header
// it initiates the map and fills the map div based on users lat and long retrieved fro IP Address
// additionally it invokes the function which renders all postOffices
async function renderDetails(){

    ipAddress.innerHTML=`IP Address : ${localStorage.getItem("ipAddress")}`; 
    try{
        const response = await fetch(`https://ipapi.co/${localStorage.getItem("ipAddress")}/json/`);
        const result = await response.json();
        const date = new Date().toLocaleString("en-US", { timeZone: `${result.timezone}` });
        for(let i = 0;i<6;i++){
           if(i==0)details[i].innerHTML=`Lat : ${result.latitude}`
           if(i==1)details[i].innerHTML=`Long : ${result.longitude}`
           if(i==2)details[i].innerHTML=`City : ${result.city}`
           if(i==3)details[i].innerHTML=`Region : ${result.region}`
           if(i==4)details[i].innerHTML=`HostName : ${location.hostname}`;
           if(i==5)details[i].innerHTML="Organisation : Postal Services";
        }
   
       for(let i = 0;i<4;i++){
           if(i==0)moreDetails[i].innerHTML=`Time Zone : ${result.timezone}`;
           if(i==1)moreDetails[i].innerHTML=`Date And Time : ${date}`;
           if(i==2)moreDetails[i].innerHTML=`Pincode : ${result.postal}`;
           
       }
   
         map = new google.maps.Map(document.getElementById("map"), {
         center: { lat: result.latitude, lng: result.longitude },
         zoom: 8,
       });
   
       fillPostOfficeArray(result.postal);
        
    }
    catch(e){
        console.log(e);
    }
  
   
    

}


// this function pushes all post office details we get to the post_office array
// it also invokes renderPostOffices function which ultimately dynamically adds all post offices
async function fillPostOfficeArray(postal){
    try{
        const response = await fetch(`https://api.postalpincode.in/pincode/${postal}`);
        const result = await response.json();
        const data = result["0"];
        
        moreDetails[3].innerHTML=data.Message;
        
        data.PostOffice.forEach((item)=>{
            let temp = [];
            temp.push(item.Name);
            temp.push(item.BranchType);
            temp.push(item.DeliveryStatus);
            temp.push(item.District);
            temp.push(item.Division);
            post_offices.push(temp);
        });
        renderPostOffices();
    }
   catch(e){
    console.log(e.Message);
   }
    



}




// this is the ultimate renderPostOffice function which loads all post_offices
function renderPostOffices(arr=post_offices){
    post_office_Div.innerHTML=``;

    arr.forEach((item)=>{
        const newDiv = document.createElement("div");
        newDiv.innerHTML=` <p>Name :${item[0]}</p>
        <p>Branch Type :${item[1]}</p>
        <p>Delivery Status :${item[2]}</p>
        <p>District : ${item[3]}</p>
        <p>Division : ${item[4]}</p>`;
        post_office_Div.appendChild(newDiv);
    })
    
}

// filter array is a debounce function that is invoked on keypress to search all post offices whose name starts with given input name
function filterArray(str){
    clearTimeout(timer);

    timer = setTimeout(()=>{
        let arr = post_offices.filter((item)=>{
            return item[0].toLowerCase().startsWith(str.toLowerCase());
        });
        renderPostOffices(arr);
    },250);
    

}

//adding on key up event listener to input to filter post offices
search_input.addEventListener("keyup",()=>{
    
    filterArray(search_input.value);
})



 