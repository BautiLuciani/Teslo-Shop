import { ShopLayout } from '@/components/layouts'
import {Box, Typography} from '@mui/material'

const ErrorPage = () => {
  return (
    <ShopLayout title='Pagina no encontrada' pageDescription='ERROR: No hay nada para mostrar en esta pagina'>
        <Box display='flex' sx={{flexDirection: {xs: 'column', sm: 'row'}}} justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
            <Typography fontSize={50} fontWeight={200}>404 |</Typography>
            <Typography marginLeft={0.5}>Esta pagina no pudo ser encontrada</Typography>
        </Box>
    </ShopLayout>
  )
}

export default ErrorPage