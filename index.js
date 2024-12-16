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
  });
});

app.post("/", async (req, res) => {
  const city = req.body.city;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`
    );
    console.log(response);

    let result = response.data;
    res.render("index.ejs", {
      temp: Math.round(result.main.temp),
      city: result.name,
      humidity: Math.round(result.main.humidity),
      wind: Math.round(3.6 * result.wind.speed),
    });
  } catch (error) {
    console.error("Error sending data", error);
    res.render("index.ejs", {
      temp: "--",
      city: "City not found!",
      humidity: "--",
      wind: "--",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
