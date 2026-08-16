#!/usr/bin/env node

require("dotenv").config();
const axios = require("axios");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const inquirer = require("inquirer");
const boxen = require("boxen");

const GL_API = "https://api.api-ninjas.com/v1/geocoding";
const GL_API_KEY = process.env.GL_API_KEY;
const W_API = "http://api.weatherapi.com/v1/current.json";
const W_API_KEY = process.env.W_API_KEY;

const getCoordinates = async (location) => {
  try {
    const response = await axios.get(GL_API, {
      params: {
        city: location,
      },
      headers: {
        "X-Api-Key": GL_API_KEY,
      },
    });
    // the api returns an array of matches but we just want the first
    return response.data[0];
  } catch (error) {
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response body:", error.response.data);
    } else {
      console.error("error:", error.message);
    }
    process.exit(1);
  }
};

const getWeather = async (lat, long) => {
  try {
    const response = await axios.get(W_API, {
      params: {
        key: W_API_KEY,
        q: `${lat},${long}`,
        // days: 5,
        // aqi: "no",
        // alerts: "no",
      },
    });
    // const {
    //   temp_f,
    //   feelslike_f,
    //   condition: { text },
    // } = response.data.current;
    // return { temp_f, feelslike_f, text };
    return response.data.current;
  } catch (error) {
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response body:", error.response.data);
    } else {
      console.error("error:", error.message);
    }
    process.exit(1);
  }
};

const main = async () => {
  const rl = readline.createInterface({ input, output });

  const userInput = await rl.question("Enter a location: ");
  rl.close();

  const { latitude, longitude } = await getCoordinates(userInput);
  //   const weather = await getWeather(latitude, longitude);

  //   console.log(weather);

  inquirer
    .prompt([
      {
        type: "list",
        message: "Select an option 🌞",
        name: "source",
        choices: [
          "Temperature in Fahrenheit",
          "Wind data",
          "Precipitation",
          "UV Index",
        ],
      },
    ])
    .then(async (answers) => {
      console.log("\n");
      const weather = await getWeather(latitude, longitude);

      switch (answers.source) {
        case "Temperature in Fahrenheit":
          console.log(
            boxen(
              `Weather : ${weather.temp_f} \u02DAF ${weather.condition.text}\nFeels like: ${weather.feelslike_f} \u02DAF`,
              { padding: 1 },
            ),
          );
          break;
        case "Wind data":
          console.log(
            boxen(
              `Wind Speed: ${weather.wind_mph} mph \nWind Degree: ${weather.wind_degree} \nWind Direction: ${weather.wind_dir}`,
              { padding: 1 },
            ),
          );
          break;
        case "Precipitation":
          console.log(
            boxen(
              `Precipitation (mm): ${weather.precip_mm} \nHumidity:${weather.humidity}`,
              { padding: 1 },
            ),
          );
          break;
        case "UV Index":
          console.log(
            boxen(`UV: ${weather.uv} \nCloud: ${weather.cloud}`, {
              padding: 1,
            }),
          );
          break;
      }
    });
};

main();
