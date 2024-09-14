import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { baseURL } from '../../utils/FetchData'
import { normalize } from '../../utils/NormalizeData'

export default function MediaItemViewer() {
  const { media, id } = useParams()
  const [firstRender, setFirstRender] = useState(true)
  const [itemDetails, setItemDetails] = useState({})
  const [auxData, setAuxData] = useState({})

  useEffect(() => {
    async function fetchItemDetails(mMedia, mId) {
      const response = await fetch(`${baseURL}${mMedia}/${mId}`)
      const data = await response.json()
      setItemDetails(normalize[mMedia](data))
      setAuxData(data)
    }
    if (firstRender) {
      fetchItemDetails(media, id)
      setFirstRender(false)
      return
    }
  }, [])
  console.log(auxData)
  async function handleGetSimilar() {
    const response = await fetch(`${baseURL}similar/${media}/${id}`)
    const data = await response.json()
    console.log(data)
  }
  return (
    <>
      <div>
        <h1>
          {itemDetails.title} {itemDetails.name}
        </h1>
        <img src={itemDetails.poster} alt="poster" />
        <p>{itemDetails.description}</p>
        <p>{itemDetails.releaseDate}</p>
        <p>{itemDetails.rating}</p>
        <a href={auxData.homepage}></a>
        <button onClick={handleGetSimilar}>GetSimilar</button>
      </div>
    </>
  )
}
