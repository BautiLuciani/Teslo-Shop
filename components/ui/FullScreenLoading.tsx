import { Box, CircularProgress } from '@mui/material'

const LoadingPage = () => {
    return (
        <Box
            display='flex' 
            justifyContent='center' 
            alignItems='center' 
            height='calc(100vh - 200px)'
        >
            {/* Con CircularProgress mostramos el tipico circulo de carga
            Con thickness definimos su grosor */}
            <CircularProgress thickness={2}/>
        </Box>
    )
}

export default LoadingPage