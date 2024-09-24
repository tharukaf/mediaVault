import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseURL } from '../../utils/FetchData'
import { normalize } from '../../utils/NormalizeData'
import { Button } from '@mui/material'
import Typography from '@mui/material/Typography'
import MovieCard from '../mediaCards/movieCard'

export default function MediaItemViewer() {
  const { media, id } = useParams()
  const [firstRender, setFirstRender] = useState(true)
  const [itemDetails, setItemDetails] = useState({})
  // const [auxData, setAuxData] = useState({})
  const [similarItems, setSimilarItems] = useState([])
  const navigate = useNavigate()

  if (media === 'music') {
    navigate('/myvault')
  }

  useEffect(() => {
    async function fetchItemDetails(mMedia, mId) {
      const response = await fetch(`${baseURL}${mMedia}/${mId}`)
      const data = await response.json()
      console.log(data)
      setItemDetails(normalize[mMedia](data))
    }
    if (firstRender) {
      fetchItemDetails(media, id)
      setFirstRender(false)
      return
    }
  }, [])

  async function handleGetSimilar() {
    const response = await fetch(`${baseURL}similar/${media}/${id}`)
    const data = await response.json()
    console.log(data.results)
    const normalized = data.results.map(item => normalize[media](item))
    console.log(normalized)
    const similarCards = normalized.map(item => {
      return (
        <MovieCard key={item.id} movie={item} type={media} isNavigate={false} />
      )
    })
    setSimilarItems(similarCards)
  }
  return (
    <>
      <div className="vault-items-view">
        <div className="itemViewContainer">
          <div className="itemViewPoster">
            <img src={itemDetails.poster} alt="poster" />
          </div>
          <div className="itemViewDetails">
            <Typography
              className="itemViewDetailTitle"
              variant="h4"
              gutterBottom>
              {itemDetails.title}
            </Typography>
            {media === 'books' && (
              <div className="itemViewAuthors">
                <Typography variant="h6">{itemDetails.authors}</Typography>
              </div>
            )}
            <Typography variant="subtitle2" gutterBottom>
              {itemDetails.description}
            </Typography>
            <div className="itemViewDetailsSecondary">
              <Typography variant="body2">
                Release Date: {itemDetails.releaseDate}
              </Typography>
              <Typography variant="body2">
                Rating: {itemDetails.rating || itemDetails.popularity}
              </Typography>
            </div>
            {media === 'movies' || media === 'tv' ? (
              <Button variant="outlined" onClick={handleGetSimilar}>
                GetSimilar
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mediaItemSimilar">{similarItems}</div>
      </div>
    </>
  )
}
