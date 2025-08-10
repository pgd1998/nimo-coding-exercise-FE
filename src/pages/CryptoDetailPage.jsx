import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Alert } from "@mui/material";
import useCoinDetail from "../hooks/useCoinDetail";
import LoadingSkeleton from "../components/LoadingSkeleton/LoadingSkeleton";
import CryptoDetails from "../components/CryptoDetails/CryptoDetails";

const CryptoDetailPage = () => {
    const { coinId } = useParams();
    const navigate = useNavigate();
    const { coinDetail, isLoading, isError, fetchCoinDetail } = useCoinDetail();

    useEffect(() => {
        if (coinId) {
            fetchCoinDetail(coinId);
        }
    }, [coinId, fetchCoinDetail]);

    const handleBackClick = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <Container maxWidth="xl">
                <LoadingSkeleton />
            </Container>
        );
    }

    if (isError || !coinDetail) {
        return (
            <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                <Alert severity="error" sx={{ mt: 4 }}>
                    {isError || 'Cryptocurrency not found'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <CryptoDetails 
                coinDetail={coinDetail} 
                onBackClick={handleBackClick} 
            />
        </Container>
    );
};

export default CryptoDetailPage;