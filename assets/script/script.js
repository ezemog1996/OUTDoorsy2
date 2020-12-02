$(document).ready(function () {
    // var ridbApiKey = "7771610e-244f-4e11-8ff0-59115fc17eb5";
    // var ridbQueryURL = "https://ridb.recreation.gov/api/v1/facilities?limit=50&offset=0&state=GA&activity=BOATING&sort=NAME&apikey=" + ridbApiKey;
    const WeatherAPIKey = "5bb3a5739d78e8deccb5b36c764be06d";
    let searchHistory = JSON.parse(localStorage.getItem("textinput"));

    if (searchHistory === null) {
        searchHistory = [];
    } else {
        for (var i = 0; i < searchHistory.length; i++) {
            //create button template
            let btnMarkUp = `<button class="recent-search destination button is-success is-fullwidth is-outlined" "cityname="${searchHistory[i]}">${searchHistory[i]}</button><br>`;
            //add button to container for btns
            $("#recent-searches").append(btnMarkUp);
        }
        $(".recent-search").on("click", function (event) {
            getWeatherData(event.target.textContent);
        });
    }


    //On click of search button
    $("#search-button").on('click', function (event) {

        event.preventDefault()
        //get users input cityName
        const userInput = $("#search-text").val();
        //show all weather data
        getWeatherData(userInput);

        searchHistory.push(userInput);
        localStorage.setItem('textinput', JSON.stringify(searchHistory));

        //create button template
        let btnMarkUp = `<button class="recent-search destination button is-success is-fullwidth is-outlined" "cityname="${userInput}">${userInput}</button><br>`;
        //add button to container for btns
        $("#recent-searches").append(btnMarkUp);
        //add event listener to it
        $(".recent-search").on("click", function (event) {
            getWeatherData(event.target.textContent);
        });
    })
    const getWeatherData = (cityName) => {
        const userChoiceURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WeatherAPIKey}`;
        //Pull Current Day data from weather api
        $.ajax({
            url: userChoiceURL,
            method: "GET"
        }).then(function (res) {
            console.log("current weather: ", res);

            // update map with city
            
            //write the markup which is a string
            const currentMarkUp =
                `
                <div id="current-day" class="border rounded">
                    <h2>
                        <h1 class= "is-size-3"><span>${res.name}</span></h1>
                        <h1 class= "is-size-4"><span>(${new Date().toLocaleDateString()})</span></h1>
                        <span><img src="https://openweathermap.org/img/w/${res.weather[0].icon}.png"/></span>
                    </h2>
                    <p>Temperature: ${Math.round(((parseInt(res.main.temp) - 273.15) * (9 / 5) + 32) * 10) / 10}\u00B0F</p>
                    <p>Humidity: ${res.main.humidity}%</p>
                    <p>Wind Speed: ${res.wind.speed}MPH</p>
                </div>
            `;
            //we convert the markup string into html then add it to the page
            $("#current-day").html(currentMarkUp);

            //the hiking trails of 
            console.log(res)
            const lat = (res.coord.lat)
            const lon = (res.coord.lon)

            var activity = $("#activities").val();

            var ridbURL = `https://cors-anywhere.herokuapp.com/https://ridb.recreation.gov/api/v1/facilities?limit=50&offset=0&full=true&latitude=${lat}&longitude=${lon}&sort=distance&radius=25&apikey=36db8c2c-0f5e-4c3d-878c-d0f5d7702064`

            var settings = {
                "url": ridbURL,
                "method": "GET",
                "datatype": "json",
                headers: {
                "x-requested-with": "xhr"
                }
              };
              
              $.ajax(settings).done(function (response) {
                console.log(response);
              });

        });


    }

})
// Google Map API //

if (screen.width <= 768) {
    var destinationsDiv = $("#left").html();
    var searchDiv = $("#right").html();
    var descriptionDiv = $("#middle").html();

    $("#left").html(descriptionDiv);
    $("#middle").html(searchDiv);
    $("#right").html(destinationsDiv);
}


// $("#search-text").on("keypress", function(event) {
//     if (event.key="enter") {
//         var settings = {
//             "url": "https://cors-anywhere.herokuapp.com/https://ridb.recreation.gov/api/v1/facilities?limit=50&offset=0&full=true&state=CA&activity=BOATING&apikey=36db8c2c-0f5e-4c3d-878c-d0f5d7702064",
//             "method": "GET",
//             "datatype": "json",
//             headers: {
//             "x-requested-with": "xhr"
//             }
//           };
          
//           $.ajax(settings).done(function (response) {
//             console.log(response);
//           });
//     }
// })