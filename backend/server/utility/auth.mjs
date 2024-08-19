import 'dotenv/config'

export async function authenticateIGDB(
  req,
  res,
  next,
  IGDB_ACCESS_TOKEN,
  igdbExpireTime
) {
  if (!IGDB_ACCESS_TOKEN || Date.now() >= igdbExpireTime) {
    // if (!IGDB_ACCESS_TOKEN) {
    const tokData = {}
    const clientId = process.env.IGDB_CLIENT_ID
    const clientSecret = process.env.IGDB_CLIENT_SECRET
    const authUrl = 'https://id.twitch.tv/oauth2/token'
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    }

    try {
      const response = await fetch(authUrl, authOptions)
      const json = await response.json()
      if (json.access_token) {
        // IGDB_ACCESS_TOKEN = json.access_token
        // igdbExpireTime = json.expires_in * 1000 + Date.now()
        tokData.tok = json.access_token
        tokData.exp = json.expires_in * 1000 + Date.now()
        // next()
        return tokData
      } else {
        throw new Error('Failed to authenticate with IGDB')
      }
    } catch (err) {
      console.error('error:' + err)
      res.status(500).send('Failed to authenticate with IGDB')
    }
  }
}

export async function authenticateSpotify(
  req,
  res,
  next,
  SPOTIFY_ACCESS_TOKEN,
  spotify_token_expire_time
) {
  if (!SPOTIFY_ACCESS_TOKEN || Date.now() >= spotify_token_expire_time) {
    const authUrl = 'https://accounts.spotify.com/api/token'
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
    }

    fetch(authUrl, authOptions)
      .then(res => res.json())
      .then(json => {
        if (json.access_token) {
          SPOTIFY_ACCESS_TOKEN = json.access_token
          spotify_token_expire_time = json.expires_in * 1000 + Date.now()
          next()
        } else {
          throw new Error('Failed to authenticate with Spotify')
        }
      })
      .catch(err => {
        console.error('error:' + err)
        res.status(500).send('Failed to authenticate with Spotify')
      })
  }
}
