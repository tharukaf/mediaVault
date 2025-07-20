import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseURL } from '../../utils/FetchData'
import { normalize } from '../../utils/NormalizeData'
import { Button, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip, Stack } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useAuth } from '../../utils/UserContext'
import Typography from '@mui/material/Typography'
import MovieCard from '../mediaCards/movieCard'
import ReviewSection from './ReviewSection.jsx'

export default function MediaItemViewer() {
  const { currentUser } = useAuth()
  const { media, id } = useParams()
  const [firstRender, setFirstRender] = useState(true)
  const [itemDetails, setItemDetails] = useState({})
  const [similarItems, setSimilarItems] = useState([])
  const [openDelete, setOpenDelete] = useState(false)
  const navigate = useNavigate()

  if (media === 'music') {
    navigate('/myvault')
  }

  useEffect(() => {
    async function fetchItemDetails(mMedia, mId) {
      const response = await fetch(`${baseURL}${mMedia}/${mId}`)
      const data = await response.json()
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
    const normalized = data.results.map(item => normalize[media](item))
    const similarCards = normalized.map(item => {
      return (
        <MovieCard key={item.id} movie={item} type={media} isNavigate={false} />
      )
    })
    setSimilarItems(similarCards)
  }
  async function handleDeleteMedia() {
    const email = localStorage.getItem('userEmail') || (currentUser && currentUser.email)
    if (!email) return
    await fetch(`${baseURL}users/media/${media}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setOpenDelete(false)
    navigate('/myvault')
  }

  return (
    <>
      <div className="vault-items-view">
        <div className="itemViewContainer" style={{ position: 'relative' }}>
          <IconButton
            aria-label="delete"
            onClick={() => setOpenDelete(true)}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, color: 'grey.400' }}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
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
            <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Release: ${itemDetails.releaseDate ? new Date(itemDetails.releaseDate * 1000).toLocaleDateString() : 'N/A'}`}
                color="info"
                variant="outlined"
                sx={{ fontWeight: 500, fontSize: 14, bgcolor: 'rgba(0,128,128,0.08)', color: 'teal', borderColor: 'teal' }}
              />
              <Chip
                label={`Rating: ${itemDetails.rating || itemDetails.popularity || 'N/A'}`}
                color="success"
                variant="outlined"
                sx={{ fontWeight: 500, fontSize: 14, bgcolor: 'rgba(0,128,128,0.08)', color: 'teal', borderColor: 'teal' }}
              />
            </Stack>
            {/* Delete button moved to top right as icon */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
              <DialogTitle>Remove from My Vault?</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to remove this media item from your vault? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDelete(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDeleteMedia} color="error" variant="contained">
                  Remove
                </Button>
              </DialogActions>
            </Dialog>
            {media === 'movies' || media === 'tv' ? (
              <Button variant="outlined" onClick={handleGetSimilar} sx={{ ml: 2 }}>
                GetSimilar
              </Button>
            ) : null}
          </div>
        </div>
        <Paper className="mediaItemReviewSection"
          sx={{ margin: '2rem', borderRadius: 2, maxWidth: 600 }}>
          <ReviewSection mediaId={id} mediaType={media} />
        </Paper>
        <div className="mediaItemSimilar">{similarItems}</div>
      </div>
    </>
  )
}
