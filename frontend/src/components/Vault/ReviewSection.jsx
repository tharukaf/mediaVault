/*
  ReviewSection.jsx
  Displays and allows CRUD for reviews for a media item.
*/
import { useEffect, useState } from 'react'
import { baseURL } from '../../utils/FetchData'
import { useAuth } from '../../utils/UserContext'
import { Button, TextField, Rating, Typography, Box, Card, CardHeader, CardContent, Avatar, Stack, Divider, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { styled } from '@mui/material/styles'

const GradientHeader = styled(Box)(({ theme }) => ({
    width: '100%',
    borderRadius: '10px 10px 0 0',
    padding: theme.spacing(2),
    background: 'linear-gradient(90deg, rgba(0,255,255,0.37) 0%, #008080 100%)',
    color: theme.palette.getContrastText('#008080'),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
}))

export default function ReviewSection({ mediaId, mediaType }) {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [reviewText, setReviewText] = useState('')
    const [rating, setRating] = useState(0)
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')
    const [editRating, setEditRating] = useState(0)

    useEffect(() => {
        fetch(`${baseURL}api/reviews/${mediaType}/${mediaId}`)
            .then(res => res.json())
            .then(setReviews)
            .catch(error => console.error('Error fetching reviews:', error))
    }, [mediaId, mediaType])

    const handleSubmit = async e => {
        e.preventDefault()
        const review = {
            mediaId,
            mediaType,
            userName: user.name,
            rating,
            reviewText,
        }
        try {
            const res = await fetch(`${baseURL}api/reviews/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review),
            })
            if (res.ok) {
                setReviewText('')
                setRating(0)
                setReviews([...reviews, await res.json()])
            }
        } catch (error) {
            console.error('Error creating review:', error)
        }
    }

    const handleDelete = async id => {
        try {
            const response = await fetch(`${baseURL}api/reviews/${id}`, { method: 'DELETE' })
            if (response.ok) {
                setReviews(reviews.filter(r => r._id !== id))
            }
        } catch (error) {
            console.error('Error deleting review:', error)
        }
    }

    const handleEdit = review => {
        setEditingId(review._id)
        setEditText(review.reviewText)
        setEditRating(review.rating)
    }

    const handleEditSubmit = async e => {
        e.preventDefault()
        try {
            const res = await fetch(`${baseURL}api/reviews/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewText: editText, rating: editRating }),
            })
            if (res.ok) {
                setReviews(
                    reviews.map(r =>
                        r._id === editingId ? { ...r, reviewText: editText, rating: editRating } : r
                    )
                )
                setEditingId(null)
            }
        } catch (error) {
            console.error('Error updating review:', error)
        }
    }

    return (
        <Box sx={{ mt: 4, maxWidth: 600 }}>
            <GradientHeader>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>Reviews</Typography>
            </GradientHeader>
            <Stack spacing={2} divider={<Divider flexItem />} sx={{ mb: 3, p: 2, borderRadius: 2 }}>
                {reviews.length === 0 && (
                    <Card elevation={1} sx={{ mb: 2, p: 2 }}>
                        <CardContent>
                            <Typography>No reviews yet.</Typography>
                        </CardContent>
                    </Card>
                )}
                {reviews.map(review => (
                    <Card key={review._id} elevation={2} sx={{ maxWidth: 600, ml: 2 }}>
                        <CardHeader
                            avatar={<Avatar>{review.userName[0]?.toUpperCase()}</Avatar>}
                            title={review.userName}
                            subheader={new Date(review.reviewDate).toLocaleDateString()}
                            action={
                                user.name === review.userName && (
                                    <>
                                        <Tooltip title="Edit" arrow>
                                            <IconButton size="small" onClick={() => handleEdit(review)} sx={{ color: 'grey.500', mr: 0.5 }}>
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                            <IconButton size="small" onClick={() => handleDelete(review._id)} sx={{ color: 'grey.400' }}>
                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )
                            }
                        />
                        <CardContent>
                            <Rating value={review.rating} readOnly sx={{ mb: 1, color: 'teal' }} />
                            <Typography variant="body1">{review.reviewText}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            {editingId ? (
                <Card elevation={1} sx={{ maxWidth: 600, mb: 2 }}>
                    <CardContent>
                        <form onSubmit={handleEditSubmit}>
                            <TextField
                                label="Edit Review"
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                fullWidth
                                multiline
                                sx={{ mb: 1 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating value={editRating} onChange={(_, v) => setEditRating(v)} sx={{ color: 'teal' }} />
                                <Box sx={{ flex: 1 }} />
                                <Button type="submit" variant="contained" sx={{ ml: 1 }}>Save</Button>
                                <Button onClick={() => setEditingId(null)} sx={{ ml: 1 }}>Cancel</Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card elevation={1} sx={{ maxWidth: 600, mb: 2 }}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Write a review"
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                fullWidth
                                multiline
                                sx={{ mb: 1 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Rating value={rating} onChange={(_, v) => setRating(v)} sx={{ color: 'teal' }} />
                                <Box sx={{ flex: 1 }} />
                                <Button type="submit" variant="contained" sx={{ ml: 2, whiteSpace: 'nowrap' }}>Submit</Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            )}
        </Box>
    )
}
