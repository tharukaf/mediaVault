/*
  ReviewSection.jsx
  Displays and allows CRUD for reviews for a media item.
*/
import { useEffect, useState } from 'react'
import { baseURL } from '../../utils/FetchData'
import { useAuth } from '../../utils/UserContext'
import { Button, TextField, Rating, Typography, Box, Card, CardHeader, CardContent, Avatar, Stack, Divider } from '@mui/material'

export default function ReviewSection({ mediaId, mediaType }) {
    const { currentUser } = useAuth()
    const [reviews, setReviews] = useState([])
    const [reviewText, setReviewText] = useState('')
    const [rating, setRating] = useState(0)
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')
    const [editRating, setEditRating] = useState(0)

    useEffect(() => {
        fetch(`${baseURL}reviews/${mediaType}/${mediaId}`)
            .then(res => res.json())
            .then(setReviews)
    }, [mediaId, mediaType])

    const handleSubmit = async e => {
        e.preventDefault()
        const review = {
            mediaId,
            mediaType,
            userName: currentUser.name,
            rating,
            reviewText,
        }
        const res = await fetch(`${baseURL}reviews/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        })
        if (res.ok) {
            setReviewText('')
            setRating(0)
            setReviews([...reviews, await res.json()])
        }
    }

    const handleDelete = async id => {
        await fetch(`${baseURL}reviews/${id}`, { method: 'DELETE' })
        setReviews(reviews.filter(r => r._id !== id))
    }

    const handleEdit = review => {
        setEditingId(review._id)
        setEditText(review.reviewText)
        setEditRating(review.rating)
    }

    const handleEditSubmit = async e => {
        e.preventDefault()
        const res = await fetch(`${baseURL}reviews/${editingId}`, {
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
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Reviews</Typography>
            <Stack spacing={2} divider={<Divider flexItem />} sx={{ mb: 3 }}>
                {reviews.length === 0 && <Typography>No reviews yet.</Typography>}
                {reviews.map(review => (
                    <Card key={review._id} elevation={2} sx={{ maxWidth: 600 }}>
                        <CardHeader
                            avatar={<Avatar>{review.userName[0]?.toUpperCase()}</Avatar>}
                            title={review.userName}
                            subheader={new Date(review.reviewDate).toLocaleDateString()}
                            action={
                                currentUser.name === review.userName && (
                                    <>
                                        <Button size="small" onClick={() => handleEdit(review)}>Edit</Button>
                                        <Button size="small" color="error" onClick={() => handleDelete(review._id)}>Delete</Button>
                                    </>
                                )
                            }
                        />
                        <CardContent>
                            <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
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
                            <Rating value={editRating} onChange={(_, v) => setEditRating(v)} />
                            <Button type="submit" variant="contained" sx={{ ml: 1 }}>Save</Button>
                            <Button onClick={() => setEditingId(null)} sx={{ ml: 1 }}>Cancel</Button>
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
                            <Rating value={rating} onChange={(_, v) => setRating(v)} />
                            <Button type="submit" variant="contained" sx={{ ml: 1 }}>Submit</Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </Box>
    )
}
