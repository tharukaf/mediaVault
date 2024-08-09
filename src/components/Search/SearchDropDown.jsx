import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

export default function SearchDropDown({
  optionList,
  searchType,
  setSearchText,
  searchText,
}) {
  let typingTimer = null
  return (
    <div id="textfield-box">
      <Autocomplete
        sx={{ width: '90%' }}
        options={optionList}
        autoHighlight
        getOptionLabel={option => option.title}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props
          return (
            <Box
              key={option.id}
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...optionProps}>
              <img loading="lazy" width="50" src={option.poster} alt="" />
              {option.title}{' '}
              {(searchType === 'movie' || searchType === 'tv') &&
                option.releaseDate &&
                `(${option.releaseDate.slice(0, 4)})`}
              {searchType === 'book' && (
                <div className="dropdownArtists">{option.authors}</div>
              )}
              {searchType === 'music' && (
                <div className="dropdownArtists">{option.artists}</div>
              )}
            </Box>
            // <div key={option.id}>name</div>
          )
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            onChange={e => {
              clearTimeout(typingTimer)
              typingTimer = setTimeout(() => {
                // console.log('timer done')
                setSearchText(e.target.value)
              }, 400)
            }}
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
