import { useState } from "react";
import CryptoTable from "../components/CryptoTable/CryptoTable";
import SearchBar from "../components/SearchBar/SearchBar";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import { Container, Typography, Box, Stack } from "@mui/material";

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    sx={{ mb: 3 }}
                >
                    <Typography variant="h3" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Cryptocurrency Market
                    </Typography>
                    <ThemeToggle size="large" />
                </Stack>
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