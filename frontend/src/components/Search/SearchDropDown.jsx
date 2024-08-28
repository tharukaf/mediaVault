import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { debounce } from 'lodash'
import Button from '@mui/material/Button'
import { baseURL } from '../../utils/FetchData'

export default function SearchDropDown({
  optionList,
  searchType,
  setSearchText,
  searchText,
}) {
  const handleTextChange = debounce(e => {
    setSearchText(e.target.value)
  }, 400)

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
              // borderColor="primary.dark"
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
                // onClick={async () => {
                //   const url = `${baseURL}${searchType}/${option.id}`
                //   console.log(url)
                //   // TODO: add user email to body
                //   const options = { email: 'me@example.com' }
                //   const response = await fetch(url, {
                //     method: 'POST',
                //     headers: {
                //       'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(options),
                //   })
                //   console.log(response)
                // }}
                variant="outlined"
                style={{ fontSize: '10px', marginLeft: '10px' }}>
                +
              </Button>
            </Box>
            // <div key={option.id}>name</div>
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
