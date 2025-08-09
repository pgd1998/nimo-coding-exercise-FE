
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';

const MySearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search cryptocurrencies..." }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Search Cryptocurrencies"
        placeholder={placeholder}
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />
    </Box>
  );
};

export default MySearchBar;