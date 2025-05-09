const cityName=document.querySelector('.city-info');
const time=document.querySelector('.time-info');
const weather=document.querySelector('.weather-info');
const symbol=document.querySelector('.weather-symbol');
const temperature=document.querySelector('.temperature');
const minTemp=document.getElementById('min-temp');
const maxTemp=document.getElementById('max-temp');
const[feelImg,humidityImg,windImg,pressureImg]=document.getElementsByClassName('fa-solid');
const[feelInfo,humidityInfo,windInfo,pressureInfo]=document.getElementsByClassName('info');
const searchInput = document.getElementById("searchInput");
const dropdownOptions = document.getElementById("dropdownOptions");

const colors={Clear:"#00BFFF",Sunny:"#ffa600",Clouds:"#a4a1a0"};


const degreeSymbol='&#8451';
const key = "ecf51d4789fbe66577ff5406b93d07d0";
let apiURL;
let locate;


async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

async function getLink() {
    locate = await getLocation();
    apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${locate[0]}&lon=${locate[1]}&appid=${key}`;
}

window.onload = async () => {
    try {
        await getLink();
        fetchAPI(apiURL);
    } catch (error) {
        console.error('Error getting location:', error);
    }
};

async function fetchAPI(apiURL) {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        console.log(data);
        const main=(data.main);
        const w=data.weather[0];
        const sys=data.sys;
        const coord=data.coord;  
        const wind=data.wind;
        const celsius=Math.floor(main.temp-273.15);
        const fahrenheit=celsius*(9/5)+32;
        cityName.textContent=data.name;
        weather.textContent=w.main;
        weather.style.backgroundColor=colors[w.main];
        symbol.innerHTML=`<img src="https://openweathermap.org/img/wn/${w.icon}@2x.png"/>`;
        temperature.innerHTML=celsius+degreeSymbol;
        minTemp.innerHTML="Min:"+celsius+degreeSymbol;
        maxTemp.innerHTML="Max:"+celsius+degreeSymbol;
        feelInfo.innerHTML=Math.floor(main.feels_like-273.15)+degreeSymbol;
        humidityInfo.textContent=main.humidity;
        pressureInfo.textContent=main.pressure;
        windInfo.textContent=wind.speed;

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


let countryCityList = [];
let cityCount = [];

// Debounce function to limit the rate of function execution
function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Function to filter and display dropdown options
function updateDropdown() {
    const query = searchInput.value.toLowerCase();
    dropdownOptions.innerHTML = ""; // Clear previous options

    if (query) {
        const filteredCities = countryCityList.filter(city => city.toLowerCase().includes(query));
        filteredCities.forEach(city => {
            const option = document.createElement("div");
            option.textContent = city;
            option.addEventListener("click", async () => {
                searchInput.value = city; // Set the selected value
                apiURL=await getLatLon(searchInput.value);
                fetchAPI(apiURL);


                dropdownOptions.style.display = "none"; // Hide dropdown
            });
            dropdownOptions.appendChild(option);
        });

        dropdownOptions.style.display = "block"; 
    } else {
        dropdownOptions.style.display = "none"; 
    }
}

async function getData() {
    try {
        
        const response = await fetch("http://localhost:8080/cities");
        const data=await response.json();

        for(const country in data){
            if(data.hasOwnProperty(country)){
                const cities=data[country];
                const citi_country=cities.map(city => `${city}, ${country}`);
                countryCityList.push(...citi_country);
            }
        }
        console.log(countryCityList);
    } catch (error) {
        console.error('Error fetching country and city data:', error);
    }
}


searchInput.addEventListener("input", debounce(updateDropdown, 300));


document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown-wrapper")) {
        dropdownOptions.style.display = "none";
    }
});


getData();

async function getLatLon(searchValue){
    try{
        console.log(searchValue);
        const response= await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=1&appid=${key}`);
        const data=await response.json();
        apiURL=`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${key}`;
        console.log(apiURL);
        return apiURL;
        
    }
    catch(error)
    {
        console.log(error);
    }
}
