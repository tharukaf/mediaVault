const PORT = 8000
import express from "express"
import cors from "cors"
import "dotenv/config"
import fetch from "node-fetch"

const app = express()
// const IGDB_ACCESS_TOKEN = {}
app.use(cors())

// console.log(dotenv.config)

// Authenticate IGDB
app.use("/game/:name", (req, res, next) => {
  const clientId = process.env.IGDB_CLIENT_ID
  const clientSecret = process.env.IGDB_CLIENT_SECRET
  const authUrl = "https://id.twitch.tv/oauth2/token"
  const authOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
  }

  fetch(authUrl, authOptions)
    .then((res) => res.json())
    .then((json) => {
      if (json.access_token) {
        process.env.IGDB_ACCESS_TOKEN = json.access_token
        next()
      } else {
        throw new Error("Failed to authenticate with IGDB")
      }
    })
    .catch((err) => {
      console.error("error:" + err)
      res.status(500).send("Failed to authenticate with IGDB")
    })
})

// Game route
app.get("/game/:name", (req, res) => {
  const gameName = req.params.name
  const url = `https://api.igdb.com/v4/games`
  const options = {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      search: gameName,
      fields: "name,summary,cover.url",
      limit: 1,
    }),
  }

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => res.json(json))
    .catch((err) => console.error("error:" + err))
})

// Book route
app.get("/book/:name", (req, res) => {
  const bookName = req.params.name
  const url = `https://www.googleapis.com/books/v1/volumes?q=${bookName}`
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  }

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => res.json(json))
    .catch((err) => console.error("error:" + err))
})

// Music route
app.get("/music/:name", (req, res) => {
  const musicName = req.params.name
  const url = `https://api.spotify.com/v1/search?q=${musicName}&type=track`
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.SPOTIFY_API_KEY,
    },
  }

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => res.json(json))
    .catch((err) => console.error("error:" + err))
})

// Movie route
app.get("/movie/:name", (req, res) => {
  const movieName = req.params.name
  const url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=1`
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.TMDB_API_KEY,
    },
  }

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => res.json(json))
    .catch((err) => console.error("error:" + err))
})

// TV route
app.get("/tv/:name", (req, res) => {
  const tvName = req.params.name
  const url = `https://api.themoviedb.org/3/search/tv?query=${tvName}&include_adult=false&language=en-US&page=1`
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.TMDB_API_KEY,
    },
  }

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => res.json(json))
    .catch((err) => console.error("error:" + err))
})

// Root route
app.get("/", (req, res) => {
  res.send("Hello user! Welcome to the search engine API")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
