import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { debounce } from 'lodash'
import Button from '@mui/material/Button'
import { baseURL } from '../../utils/FetchData'
import { AuthContext, useAuth } from '../../utils/UserContext'
import { useContext, useRef, useEffect } from 'react'
import { TestContext } from './Search'

const Status = {
  Init: 'Init',
  Consumed: 'Consumed',
  WantTo: 'WantTo',
}

export default function SearchDropDown(props) {
  const { optionList, searchType, setSearchText, searchText } = props
  const auth = useAuth()
  const { inMemoryMediaList, setInMemoryMediaList } = useContext(TestContext)
  const handleTextChange = debounce(e => {
    setSearchText(e.target.value)
  }, 400)
  const storage = useRef(window.localStorage)

  useEffect(() => {
    storage.current.setItem(
      [searchType],
      JSON.stringify(inMemoryMediaList[searchType])
    )
  }, [inMemoryMediaList])
  // console.log(JSON.parse(storage.current.getItem(movies[1]?.id)))
  const { currentUser } = useContext(AuthContext)
  // console.log(inMemoryMediaList)

  const handleAddMediaToList = option => {
    return async () => {
      const url = `${baseURL}users/${auth.currentUser.email}/${searchType}/${option.id}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
        },
        // body: JSON.stringify(options),
      })
      console.log(response)
    }
  }

  const handleAddToStorage = id => {
    return () => {
      fetch(`${baseURL}${searchType}/${id}`, {
        method: 'POST',
      })
      setInMemoryMediaList(prev => {
        return {
          ...prev,
          [searchType]: { ...prev[searchType], [id]: Status.Init },
        }
      })
    }
  }

  function handleAddMedia(option) {
    if (currentUser.name == 'Guest') {
      return handleAddToStorage(option.id)
    } else {
      return handleAddMediaToList(option)
    }
  }

  // // CORS Fixed
  // async function fetchHelper() {
  //   const res = await fetch(`${baseURL}viewcount`, {
  //     method: 'GET',
  //     mode: 'cors',
  //     credentials: 'include',
  //   })
  //   const data = await res.json()
  // }

  return (
    <div id="textfield-box">
      <Autocomplete
        disableCloseOnSelect
        autoSelect={true}
        sx={{ width: '90%' }}
        options={optionList}
        autoHighlight
        getOptionLabel={option => option.title}
        renderOption={(props, option) => {
          // eslint-disable-next-line no-unused-vars
          const { key, ...optionProps } = props
          return (
            <Box
              key={option.id}
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...optionProps}>
              <img loading="lazy" width="50" src={option.poster} alt="" />
              {option.title}{' '}
              {(searchType === 'movies' || searchType === 'tv') &&
                option.releaseDate &&
                `(${option.releaseDate.slice(0, 4)})`}
              {searchType === 'books' && (
                <div className="dropdownArtists">{option.authors}</div>
              )}
              {searchType === 'music' && (
                <div className="dropdownArtists">{option.artists}</div>
              )}
              <Button
                onClick={handleAddMedia(option)}
                variant="outlined"
                style={{ fontSize: '10px', marginLeft: '10px' }}>
                +
              </Button>
            </Box>
          )
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            onChange={handleTextChange}
            value={searchText}
            label={`Search for ${
              searchType.charAt(0).toUpperCase() + searchType.slice(1)
            } `}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off', // disable autocomplete and autofill
            }}
          />
        )}
      />
    </div>
  )
}
