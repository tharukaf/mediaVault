import mongoose from 'mongoose'

export const movieSchema = new mongoose.Schema({
  _id: Number,
  adult: Boolean,
  backdrop_path: String,
  belongs_to_collection: Boolean,
  budget: Number,
  genres: [],
  homepage: String,
  imdb_id: String,
  origin_country: [],
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: {
    type: String,
    default: '',
  },
  production_companies: [],
  production_countries: [],
  release_date: String,
  revenue: Number,
  runtime: Number,
  spoken_languages: [],
  status: String,
  tagline: String,
  title: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
})

export const tvSchema = new mongoose.Schema({
  _id: Number,
  adult: Boolean,
  backdrop_path: String,
  genre_ids: [],
  origin_country: [String],
  original_language: String,
  original_name: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  first_air_date: String,
  name: String,
  vote_average: Number,
  vote_count: Number,
})

export const gameSchema = new mongoose.Schema({
  _id: Number,
  cover: {
    id: Number,
    url: String,
  },
  first_release_date: Number,
  genres: [],
  name: String,
  platforms: [],
  aggregated_rating: Number,
  rating_count: Number,
  summary: String,
})

export const industryIdentifiersSchema = new mongoose.Schema({
  type: String,
  identifier: Number,
})

export const bookSchema = new mongoose.Schema({
  _id: String,
  title: String,
  subtitle: String,
  authors: [String],
  publishedDate: String,
  description: String,
  industryIdentifiers: [industryIdentifiersSchema],
  readingModes: {
    text: Boolean,
    image: Boolean,
  },
  pageCount: Number,
  printType: String,
  categories: [String],
  averageRating: Number,
  ratingsCount: Number,
  maturityRating: String,
  allowAnonLogging: Boolean,
  contentVersion: String,
  panelizationSummary: {
    containsEpubBubbles: Boolean,
    containsImageBubbles: Boolean,
  },
  imageLinks: {
    smallThumbnail: String,
    thumbnail: String,
  },
  language: String,
  previewLink: String,
  infoLink: String,
  canonicalVolumeLink: String,
})

export const spotifyArtistSchema = new mongoose.Schema({
  external_urls: {
    spotify: String,
  },
  href: String,
  id: String,
  name: String,
  type: String,
  uri: String,
})

export const spotifyAlbumSchema = new mongoose.Schema({
  height: Number,
  url: String,
  width: Number,
})

export const musicSchema = new mongoose.Schema({
  _id: String,
  album: {
    album_type: String,
    artists: [spotifyArtistSchema],
    external_urls: {
      spotify: String,
    },
    href: String,
    id: String,
    images: [spotifyAlbumSchema],
    name: String,
    release_date: String,
    uri: String,
  },
  artists: [spotifyArtistSchema],
  available_markets: [],
  duration_ms: Number,
  explicit: Boolean,
  external_urls: {
    spotify: String,
  },
  href: String,

  name: String,
  popularity: Number,
  preview_url: String,
  type: String,
  uri: String,
})
