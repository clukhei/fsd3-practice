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
    limit: 10,
  });

  try {
    const result = await fetch(url);
    const chunkedData = await result.json();

    //search Giphy use await
    /*   const imgs = []
    for(let d of giphys.chunkedData) {
      const title = d.title
      const url = d.images.fixed_height.url // alternative way of writing--> d['images']['fixed_height']['url']
      imgs.push({title, url})
    } */
    const gifyUrlArr = chunkedData.data
    .filter(e => {
      return !e.title.includes('Trump')
    })
    .map((e) => {
      return {
        url: e.images.fixed_height.url,
        title: e.title,
      };
    });
    res.status(200);
    res.type('text/html')
    return res.render("gif", {
      gifyUrlArr,
      search,
      //hasContent: !!gifyUrlArr.length
      hasContent: gifyUrlArr.length > 0
    });
  } catch (e) {
    console.log(e);
  }


});

app.listen(PORT, () => {
  console.log(`${PORT} has started`);
});
