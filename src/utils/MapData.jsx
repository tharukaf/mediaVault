import SearchDropDown from '../components/Search/SearchDropDown'
import { normalize } from './NormalizeData'

export default function Map(mediaArray, searchType, setSearchText, searchText) {
  const data = mediaArray.map(normalize[searchType])
  return (
    <SearchDropDown
      optionList={data}
      searchType={searchType}
      setSearchText={setSearchText}
      searchText={searchText}
    />
  )
}
