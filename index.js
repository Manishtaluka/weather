const form = document.getElementById("form");
const cityInput = document.getElementById("city");

const resultContainer = document.getElementById("result");
const tempResult = document.getElementById("temp");
const MaxtempResult = document.getElementById("maxtemp");
const MintempResult = document.getElementById("mintemp");
const PressureResult = document.getElementById("pressure");
const HumidityResult = document.getElementById("humidity");
const NameResult = document.getElementById("name");
const descriptResult = document.getElementById("desc");

const LonResult = document.getElementById("lon");
const LatResult = document.getElementById("lat");
const CountryResult = document.getElementById("country");
const MainResult = document.getElementById("main");


form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const city = cityInput.value;
    const apikey="717fca7b7145785f731448249df7b7e9"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    

    
    fetch(url)
        .then(response=>response.json())
        .then(result=>{
            

            const readings=result.main.temp;
            const readings2=result.weather[0].description;
            const readings3=result.main.temp_max;
            const readings4=result.main.temp_min;
            const readings5=result.name;  
            const readings6=result.main.pressure;
            const readings7=result.main.humidity;

            const readings8=result.coord.lat;
            const readings9=result.coord.lon;
            const readings10=result.sys.country;
            const readings11=result.weather[0].main;



           console.log(readings);
           console.log(readings2);
           console.log(readings3);
           console.log(readings4);
           console.log(readings5);
           console.log(readings10);
           console.log(readings6);
           console.log(readings7);
           console.log(readings8);
           console.log(readings9);
           console.log(readings11);
          


           tempResult.textContent=readings+" C";
           MaxtempResult.textContent=readings3+" C";
           MintempResult.textContent=readings4+" C";
           NameResult.textContent=readings5;
            PressureResult.textContent=readings6;
             HumidityResult.textContent=readings7;

             LonResult.textContent=readings8;
             LatResult.textContent=readings9;
             CountryResult.textContent=readings10;
             MainResult.textContent=readings11;


           descriptResult.textContent=readings2;
           resultContainer.style.display="flex";
            
        })
});