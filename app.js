const { response } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = "54639bcc90eb8e4e2287a5ace20b79f7";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=metric";
  https.get(url, (response) => {
    //console.log(response);
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      console.log(weatherData);
      const temp = weatherData.main.temp;
      const feelsLike = weatherData.main.feels_like;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const humid = weatherData.main.humidity;
      const cloud = weatherData.clouds.all;
      const wind = weatherData.wind.speed;
      let dateObj = new Date(
        (weatherData.sys.sunrise + weatherData.timezone) * 1000
      );
      let utcString = dateObj.toUTCString();
      let sunriseTime = utcString.slice(-11, -4);
      let dateObj1 = new Date(
        (weatherData.sys.sunset + weatherData.timezone) * 1000
      );
      let utcString1 = dateObj1.toUTCString();
      let sunsetTime = utcString1.slice(-11, -4);
      const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.setHeader("Content-Type", "text/html");
      res.write(
        "<style>html,body {height: 100%;}html {display: table;margin: auto;}body {display: table-cell;vertical-align: middle;font-family: sans-serif;}</style>"
      );
      res.write(
        "<h1>The temperature in " +
          query +
          " is " +
          temp +
          " degree celsius</h1>"
      );
      res.write(
        "<h3>The feels like temperature is " +
          feelsLike +
          " degree celsius</h3>"
      );
      res.write("<h3>The description of weather is " + desc + "</h3>");
      res.write("<img src = " + imgURL + ">");
      res.write("<h3>The humidity is " + humid + "%</h3>");
      res.write("<h3>The cloudiness is " + cloud + "%</h3>");
      res.write("<h3>The current wind speed is " + wind + " m/s</h3>");
      res.write("<h3>The time of sunrise is " + sunriseTime + "</h3>");
      res.write("<h3>The time of sunset is " + sunsetTime + "</h3>");

      res.send();
    });
  });
});

app.listen(3000, () => console.log("Our server is running at port 3000"));
