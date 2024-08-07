import express from "express"
import cors from "cors"
import "dotenv/config"
import fetch from "node-fetch"

const PORT = 8000
const app = express()
app.use(cors())

let IGDB_ACCESS_TOKEN
let SPOTIFY_ACCESS_TOKEN
let igdbExpireTime
let spotify_token_expire_time

// Authenticate IGDB
app.use("/game/:name", (req, res, next) => {
  if (!IGDB_ACCESS_TOKEN || Date.now() >= igdbExpireTime) {
    // if (!IGDB_ACCESS_TOKEN) {
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
          IGDB_ACCESS_TOKEN = json.access_token
          // console.log("IGDB access token:", IGDB_ACCESS_TOKEN)
          igdbExpireTime = json.expires_in * 1000 + Date.now()
          next()
        } else {
          throw new Error("Failed to authenticate with IGDB")
        }
      })
      .catch((err) => {
        console.error("error:" + err)
        res.status(500).send("Failed to authenticate with IGDB")
      })
  }
  next()
})

// Spotify authentication
app.use("/music/:name", async (req, res, next) => {
  if (!SPOTIFY_ACCESS_TOKEN || Date.now() >= spotify_token_expire_time) {
    const authUrl = "https://accounts.spotify.com/api/token"
    const authOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
    }

    fetch(authUrl, authOptions)
      .then((res) => res.json())
      .then((json) => {
        if (json.access_token) {
          SPOTIFY_ACCESS_TOKEN = json.access_token
          console.log("Spotify access token:", SPOTIFY_ACCESS_TOKEN)
          spotify_token_expire_time = json.expires_in * 1000 + Date.now()
          next()
        } else {
          throw new Error("Failed to authenticate with Spotify")
        }
      })
      .catch((err) => {
        console.error("error:" + err)
        res.status(500).send("Failed to authenticate with Spotify")
      })
  }
  next()
})

// Game route
app.get("/game/:name", (req, res) => {
  const name = req.params.name

  fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": `${process.env.IGDB_CLIENT_ID}`,
      Authorization: `Bearer ${IGDB_ACCESS_TOKEN}`,
    },
    body: `fields name,summary,cover.url,first_release_date,age_ratings,aggregated_rating,platforms; search "${name}"; limit 10;`,
  })
    .then(async (response) => {
      let data = await response.json()
      res.json(data)
    })
    .catch((err) => {
      console.error(err)
    })
})

// Book route
app.get("/book/:name", (req, res) => {
  const bookName = req.params.name
  const url = `https://www.googleapis.com/books/v1/volumes?key=${process.env.GOOGLE_BOOKS_API_KEY}&q=${bookName}`
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
      Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`,
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
