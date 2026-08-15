#!/usr/bin/env node

require("dotenv").config();
const axios = require("axios");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");

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
    const {
      temp_f,
      feelslike_f,
      condition: { text },
    } = response.data.current;
    return { temp_f, feelslike_f, text };
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
  const weather = await getWeather(latitude, longitude);

  console.log(weather);
};

main();
