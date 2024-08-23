export async function fetchDataToClient(url, options, res) {
  try {
    const response = await fetch(url, options)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
  }
}

export async function fetchDataToServer(url, options) {
  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return data
  } catch (err) {
    console.error
  }
}
