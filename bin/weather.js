#!/usr/bin/env node

require("dotenv").config();
const axios = require("axios");
const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const GL_API = "https://api.api-ninjas.com/v1/geocoding";
const GL_API_KEY = process.env.GL_API_KEY;

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

const main = async () => {
  const rl = readline.createInterface({ input, output });

  const userInput = await rl.question("Enter a location: ");
  rl.close();

  const coords = await getCoordinates(userInput);
  console.log(coords);
};

main();
