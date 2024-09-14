import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext'
import { useAuth } from '../../utils/UserContext'
import { updateMediaItemStatus } from '../../utils/FetchData'
import { useNavigate } from 'react-router'

export default function MovieCard({ movie, type }) {
  const [mediaItemStatus, setMediaItemStatus] = useState(movie.mediaItemStatus)
  const [firstRender, setFirstRender] = useState(true)
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  console.log(movie.id, mediaItemStatus)
  // console.log(movie)

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false)
      return
    } else {
      updateMediaItemStatus(currentUser.email, type, movie.id, mediaItemStatus)
    }
  }, [mediaItemStatus])
  const handleStatusButtonClick = () => {
    setMediaItemStatus(mediaItemStatus === 'watched' ? 'unwatched' : 'watched')
  }

  const releaseDate =
    type === 'movies' || type === 'tv'
      ? `${movie.releaseDate.slice(0, 4)}`
      : type === 'books'
      ? `${movie.releaseDate}`
      : type === 'games'
      ? `${movie.releaseDate}`
      : 'N/A'

  return (
    <Card
      onClick={() => {
        console.log('hello')
        navigate(`${movie.id}`)
      }}
      onMouseEnter={() => {
        console.log('on enter')
      }}
      className="vault-card-item"
      sx={{ minWidth: 240, maxWidth: 240 }}>
      <CardMedia
        component="img"
        height="fit-content"
        image={movie.poster}
        alt="Movie Poster"
      />
      <CardHeader
        className="vault-card-header"
        action={
          <IconButton
            onClick={handleStatusButtonClick}
            aria-label="add to favorites">
            {mediaItemStatus === 'watched' ? (
              <CheckCircleIcon style={{ color: 'green' }} />
            ) : (
              <QueuePlayNextIcon style={{ color: 'yellow' }} />
            )}
          </IconButton>
        }
        title={movie.title.slice(0, 20) || 'N/A'}
        titleTypographyProps={{ variant: 'h7' }}
        subheader={releaseDate}
      />
    </Card>
  )
}
