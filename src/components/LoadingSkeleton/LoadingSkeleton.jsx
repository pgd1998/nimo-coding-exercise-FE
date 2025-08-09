import { 
    Box, 
    Skeleton, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";

const LoadingSkeleton = ({ rows = 20 }) => {
    return (
        <Box>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 3, borderRadius: 2 }} />
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="loading table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Skeleton variant="text" width={100} />
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton variant="text" width={80} />
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton variant="text" width={100} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from(new Array(rows)).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Skeleton variant="circular" width={24} height={24} />
                                        <Skeleton variant="text" width={150} />
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Skeleton variant="text" width={80} />
                                </TableCell>
                                <TableCell align="right">
                                    <Skeleton variant="text" width={100} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LoadingSkeleton;