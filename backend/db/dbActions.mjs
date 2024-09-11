import OptObj from '../server/utility/fetchOptionObj.mjs'
import { fetchArgs } from '../server/utility/apiAuth.mjs'
import { fetchDataToServer } from '../server/utility/fetchData.mjs'
import { Movie, Book, Music } from '../db/models/dbModels.mjs'

export async function retrieveItemByIdFromDB(model, id) {
  let isNum = /^\d+$/.test(id)
  const data = await model.findById(id)
  return data
}

export async function retrieveItemsFromDB(model, idList, res) {
  const data = await model.find({ _id: { $in: idList } })

  const addedStatus = data.map(dataItem => {
    return {
      ...dataItem._doc,
      mediaItemStatus: idList.find(
        listItem => listItem._id === dataItem._id.toString()
      ).mediaItemStatus,
    }
  })
  res.json(addedStatus)
}

export async function saveToDatabaseByID(req, res, model, optObjType) {
  const { id } = req.params
  let { options } = OptObj[optObjType](id, ...fetchArgs[optObjType])

  if (optObjType === 'game') {
    options.body = `fields name,summary,cover.url,genres,first_release_date,age_ratings,aggregated_rating,platforms; where id = ${id};`
  }

  let data = await model.findById(id)
  if (data !== null) {
    return data
  } else {
    const url = model.url(id)
    data = await fetchDataToServer(url, options)
    return model.createItem(data)
  }
}
