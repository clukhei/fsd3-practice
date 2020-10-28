const express = require("express");
const hbs = require("express-handlebars");
const fetch = require("node-fetch");
const withQuery = require("with-query").default;
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.engine("hbs", hbs({ defaultLayout: "default.hbs" }));
app.set("view engine", "hbs");

const PORT =
  parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
const GIPHY_URL = "https://api.giphy.com/v1/gifs/search";

app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.status(200);
  res.type("text/html");
  res.render("index");
});

app.get("/search", async (req, res) => {
  const search = req.query["search-term"];
  const API_KEY = `${process.env.API_KEY}`;
  const url = withQuery(GIPHY_URL, {
    q: search,
    api_key: API_KEY,
    limit:10
  });

  try {
    const result = await fetch(url);
    const chunkedData = await result.json();
    const gifUrlArr = chunkedData.data.map(e => e.images.fixed_height.url)
    console.log(gifUrlArr)
    return chunkedData;
  } catch (e) {
    console.log(e);
  }

  res.status(200);
  res.end();
});

app.listen(PORT, () => {
  console.log(`${PORT} has started`);
});
