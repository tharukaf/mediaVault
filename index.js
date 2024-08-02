const PORT = 8000
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import fetch from 'node-fetch'


const app = express()
app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/movies/:name', (req, res) => {
    const movieName = req.params.name;
    const url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=1`;
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: process.env.TMDB_API_KEY
    }
};

    fetch(url, options)
    .then(res => res.json())
    .then(json => res.json(json))
    .catch(err => console.error('error:' + err))

    })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

