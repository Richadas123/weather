const userTab = document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const searchInp = document.querySelector("[data-searchInput]");

const apiErrorContainer = document.querySelector(".api-error-container");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");



// variables needed
let currentTab = userTab;
const API_KEY= `6f4a17d84c385beac6f52151ab5c17fe`;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    apiErrorContainer.classList.remove("active");
    if(clickedTab != currentTab){      //currentTab=oldTab,    clickedTab=newTab
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){

            //kya search form wala container invisible hai, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else{
            //main pahle search wale tab pr tha, ab your weather tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //ab main your weather tab me aa gyi hun, to weather bhi display karna padega. so, let's check local storage first
            //for coordinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', ()=>{
    // pass clicked tag as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click', ()=>{
    // pass clicked tag as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");
    } else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon}=coordinates;
    //make grantContainer invisible
    grantAccessContainer.classList.remove("active");

    //make loader visible
    loadingScreen.classList.add("active");

    //API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${err?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly, we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temperature]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    //fetch values from weatherINFO object and put in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchInp.value === "") return;
    // console.log(searchInp.value);
    fetchSearchWeatherInfo(searchInp.value);
    searchInp.value = "";
});

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no  geolocation support available

    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);




async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");

    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const data= await response.json();
        if (!data.sys) {
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(err){
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${err?.message}`;
        apiErrorBtn.style.display = "none";
    }
}





