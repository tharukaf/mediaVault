import OptObj from '../server/utility/fetchOptionObj.mjs'
import { fetchArgs } from '../server/utility/apiAuth.mjs'
import { fetchDataToServer } from '../server/utility/fetchData.mjs'
import { Movie } from './models/moviemodel.mjs'

export async function retrieveItemByIdFromDB(model, id) {
  let isNum = /^\d+$/.test(id)
  const data = await model.findById(isNum ? Number(id) : 0)
  return data
}

export async function retrieveItemsFromDB(model, idList) {
  const data = await model.find({ _id: { $in: idList } })
  return data
}

export async function saveToDatabaseByID(req, res, model, optObjType) {
  const { id } = req.params
  let { options } = OptObj[optObjType](id, ...fetchArgs[optObjType])

  if (optObjType === 'game') {
    options.body = `fields name,summary,cover.url,genres,first_release_date,age_ratings,aggregated_rating,platforms; where id = ${id};`
  }

  let data = await model.findById(id)
  if (data !== null) {
    console.log('Data already exists in the database')
    return data
  } else {
    const url = model.url(id)
    data = await fetchDataToServer(url, options)
    return model.createItem(data)
  }

}
