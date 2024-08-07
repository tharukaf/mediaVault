import React from 'react'
import './mediaCards.css'

export default function MovieCard({
  title,
  releaseDate,
  description,
  posterPath,
  rating,
}) {
  return (
    <div className="movie-card">
      <img src={posterPath} alt="movie poster" />
      <h2>{title}</h2>
      <small>{releaseDate}</small>
      <p>{description}</p>
      <p>{rating}</p>
    </div>
  )
}
