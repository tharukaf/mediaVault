import React from "react"

export default function MusicCard({
  title,
  artist,
  releaseDate,
  albumArtPath,
}) {
  return (
    <div className="music-card">
      <img
        src={albumArtPath}
        alt="album art"
      />
      <h2>{title}</h2>
      <small>{artist}</small>
      <small>{releaseDate}</small>
    </div>
  )
}
