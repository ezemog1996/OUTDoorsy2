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
            let btnMarkUp = `<button class="recent-search destination button is-success is-fullwidth is-outlined hide" "cityname="${searchHistory[i]}">${searchHistory[i]}</button><br>`;
            //add button to container for btns
            $("#recent-search-div").append(btnMarkUp);
        }

        document.querySelector("#recent-searches").addEventListener("click", function() {
            var recentBtns= document.querySelectorAll(".recent-search");
            for (i = 0; i < recentBtns.length; i++) {
                if (recentBtns[i].classList.contains("hide")) {
                    recentBtns[i].classList.remove("hide")
                } else {recentBtns[i].classList.add("hide")}
            }
        })

        $(".recent-search").on("click", function (event) {
            getWeatherData(event.target.textContent);
            for (i = 0; i < document.querySelectorAll(".recent-search").length; i++) {
                document.querySelectorAll(".recent-search")[i].classList.add("hide")
            }
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
        $("#recent-search-div").append(btnMarkUp);
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
                        <h1 id="city" class= "is-size-3"><span>${res.name}</span></h1>
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

            $("#map").attr("src", `https://www.google.com/maps/embed/v1/view?key=AIzaSyDCQ8H5dD98QYZy3Lh_A63gOdM3cY-Hswk
                                    &center=${lat},${lon}&zoom=12`)

            console.log(document.querySelector("#activities").value)

            if (document.querySelector("#activities").value === "hiking") {
                const hikingKey = "200971209-f8aa46e467071360508bc929af7dda47"
                const hikingURL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&sort=distance&maxResults=500&key=${hikingKey}`
                $.ajax({
                    url: hikingURL,
                    method: "GET"
                }).then(function (resHike) {
                    console.log(resHike);
                    //trails buttons for loop the length of trails array in hike
                    let trailsMarkUp = "";

                    for (let i = 0; i < 10; i++) {
                        trailsMarkUp +=
                            `
                        <button class="destination button is-success is-outlined is-fullwidth">${resHike.trails[i].name}</button>
                        <br>
                        `;
                        $(".left-message-body").html(trailsMarkUp);


                    }
                    var viewMoreButton = "<button class='has-text-centered button is-success'>View More Results</button>";
                    $(".left-message-body").append(viewMoreButton);
                    var destinations = $(".destination");
                    for (i = 0; i < destinations.length; i++) {
                        destinations[i].addEventListener("click", function (event) {
                            console.log(resHike.trails)
                            for (j = 0; j < resHike.trails.length; j++) {
                                if (event.target.textContent === resHike.trails[j].name) {
                                    $(".title").text(resHike.trails[j].name);
                                    $(".subtitle").text(resHike.trails[j].location);
                                    $("#summary").text(resHike.trails[j].summary);
                                    $(".difficulty").text("Difficulty: " + resHike.trails[j].difficulty);
                                    $(".distance").text("Miles: " + resHike.trails[j].length);
                                    $("#main-img").attr("src", resHike.trails[j].imgMedium);
                                    $("#map").attr("src", `https://www.google.com/maps/embed/v1/view?key=AIzaSyDCQ8H5dD98QYZy3Lh_A63gOdM3cY-Hswk
                                    &center=${resHike.trails[j].latitude},${resHike.trails[j].longitude}&zoom=18`)
                                }
                            }
                        })
                    }
                });
            } else if (document.querySelector("#activities").value === "camping") {
                console.log("We wanna camp!")
            }

            // var settings = {
            //     "url": `https://cors-anywhere.herokuapp.com/https://ridb.recreation.gov/api/v1/facilities?limit=50&offset=0&full=true&latitude=${lat}&longitude=${lon}&radius=10&activity=&sort=distance&radius=25&apikey=36db8c2c-0f5e-4c3d-878c-d0f5d7702064`,
            //     "method": "GET",
            //     "datatype": "json",
            //     headers: {
            //     "x-requested-with": "xhr"
            //     }
            //   };
              
            //   $.ajax(settings).done(function (response) {
            //     console.log(response);
            //   });

        });


    }

})

if (screen.width <= 768) {
    var destinationsDiv = $("#left").html();
    var searchDiv = $("#right").html();
    var descriptionDiv = $("#middle").html();

    $("#left").html(searchDiv);
    $("#middle").html(destinationsDiv);
    $("#right").html(descriptionDiv);
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