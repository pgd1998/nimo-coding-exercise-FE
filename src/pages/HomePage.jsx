import { useState } from "react";
import CryptoTable from "../components/CryptoTable/CryptoTable";
import SearchBar from "../components/SearchBar/SearchBar";
import { Container, Typography, Box } from "@mui/material";

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Cryptocurrency Market
                </Typography>
                <SearchBar 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm}
                />
                <CryptoTable searchTerm={searchTerm} />
            </Box>
        </Container>
    );
};

export default Home;