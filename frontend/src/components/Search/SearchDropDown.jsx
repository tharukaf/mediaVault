import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { debounce } from 'lodash'
import Button from '@mui/material/Button'
import { baseURL } from '../../utils/FetchData'
import { useAuth } from '../../utils/UserContext'

const Status = {
  Init: 'Init',
  Consumed: 'Consumed',
  WantTo: 'WantTo',
}

export default function SearchDropDown(props) {
  const { optionList, searchType, setSearchText, searchText } = props
  const { currentUser } = useAuth()
  const handleTextChange = debounce(e => {
    setSearchText(e.target.value)
  }, 400)

  const handleAddMediaToList = option => {
    console.log('optionss', option.id)
    return async () => {
      const url = `${baseURL}users/media/${searchType}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, id: option.id }),
      })
    }
  }

  // Save Guest media to local storage
  const handleAddToStorage = option => {
    return () => {
      fetch(`${baseURL}${searchType}/${option.id}`, {
        method: 'POST',
      })
      if (localStorage.getItem(searchType) !== undefined) {
        const storageData = JSON.parse(localStorage.getItem(searchType))
        localStorage.setItem(
          searchType,
          JSON.stringify({ ...storageData, [option.id]: Status.Init })
        )
      } else {
        localStorage.setItem(
          searchType,
          JSON.stringify({ [option.id]: Status.Init })
        )
      }
    }
  }

  function handleAddMedia(option) {
    if (currentUser.name == 'Guest') {
      return handleAddToStorage(option)
    } else {
      return handleAddMediaToList(option)
    }
  }

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
