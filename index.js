import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const apiKey = "0931319914d6e3c53eac21af3f3d14f7";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    temp: "--",
    city: "Enter City",
    humidity: "--",
    wind: "--",
    WheatherDescription: "Clear",
    isDay: true,
  });
});

app.post("/", async (req, res) => {
  const city = req.body.city;
  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`
    );

    let result = weatherResponse.data;
    //console.log(result);

    const lon = result.coord.lon;
    const lat = result.coord.lat;

    const airResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const airQuality = airResponse.data.list[0].main.aqi;
    console.log(airQuality);

    const currentTime = Math.floor(Date.now() / 1000); //current time in UNIX time
    const sunrise = result.sys.sunrise;
    const sunset = result.sys.sunset;
    const isDay = currentTime >= sunrise && currentTime <= sunset;

    res.render("index.ejs", {
      temp: Math.round(result.main.temp),
      city: result.name,
      humidity: Math.round(result.main.humidity),
      wind: Math.round(3.6 * result.wind.speed),
      weatherDescription: result.weather[0].description || "Clear",
      isDay: isDay,
    });
  } catch (error) {
    console.error("Error sending data", error);
    res.render("index.ejs", {
      temp: "--",
      city: "City not found!",
      humidity: "--",
      wind: "--",
      weatherDescription: "Error",
      isDay: true,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
