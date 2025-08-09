

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const MySearchBar = ({setSearchTerm}) => {
  return (
    <TextField
      label="Search"
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      onChange={(e)=>setSearchTerm(e.target.value)}
    />
  );
}

export default MySearchBar;