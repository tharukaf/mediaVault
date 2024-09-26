import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext'
import { useAuth } from '../../utils/UserContext'
// eslint-disable-next-line no-unused-vars
import { baseURL, updateMediaItemStatus } from '../../utils/FetchData'
import { useNavigate } from 'react-router'

export default function MovieCard({ movie, mediaType, isNavigate }) {
  const navigate = useNavigate()

  const [mediaItemStatus, setMediaItemStatus] = useState(
    movie.mediaItemStatus || 'unwatched'
  )
  const [firstRender, setFirstRender] = useState(true)
  const { currentUser } = useAuth()
  const [isGuest] = useState(currentUser.name === 'Guest')
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false)
      return
    } else {
      if (isNavigate) {
        updateMediaItemStatus(
          currentUser.email,
          mediaType,
          movie.id,
          mediaItemStatus
        )
      }
    }
  }, [mediaItemStatus])

  const handleStatusButtonClick = e => {
    e.stopPropagation()
    setMediaItemStatus(mediaItemStatus === 'watched' ? 'unwatched' : 'watched')
  }

  const releaseDate =
    mediaType === 'movies' || mediaType === 'tv'
      ? `${movie.releaseDate.slice(0, 4)}`
      : mediaType === 'books'
      ? `${movie.releaseDate}`
      : mediaType === 'games'
      ? `${movie.releaseDate}`
      : 'N/A'

  return (
    <Card
      onClick={() => {
        if (isNavigate) {
          location.pathname === '/myvault'
            ? navigate(`${mediaType}/${movie.id}`)
            : navigate(`${movie.id}`)
        }
      }}
      className="vault-card-item"
      sx={{ minWidth: 240, maxWidth: 240 }}>
      <CardMedia
        component="img"
        height="fit-content"
        image={movie.poster}
        alt={`${movie.title} poster`}
      />
      <CardHeader
        className="vault-card-header"
        action={
          !isGuest && (
            <IconButton
              onClick={handleStatusButtonClick}
              aria-label="add to favorites">
              {mediaItemStatus === 'watched' ? (
                <CheckCircleIcon style={{ color: 'green' }} />
              ) : (
                <QueuePlayNextIcon style={{ color: 'yellow' }} />
              )}
            </IconButton>
          )
        }
        title={movie.title.slice(0, 20) || 'N/A'}
        titleTypographyProps={{ variant: 'h7' }}
        subheader={releaseDate}
      />
    </Card>
  )
}
