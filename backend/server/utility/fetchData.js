export async function fetchData(url, options, res) {
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      res.json(data)
    } catch (err) {
      console.error(err)
    }
  }