import { ShopLayout } from '@/components/layouts'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import NextLink from 'next/link'

const EmptyPage = () => {
    return (
        <ShopLayout title='Carrito Vacio' pageDescription='No se han encontrado articulos en el carrito'>
            <Box 
                display='flex' 
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }} 
                justifyContent='center' 
                alignItems='center' 
                height='calc(100vh - 200px)'
            >
                <RemoveShoppingCartOutlined sx={{fontSize: 100}}/>
                <Box 
                    display='flex' 
                    flexDirection='column' 
                    alignItems='center'
                    marginLeft={2}
                >
                    <Typography>Su carrito esta vacio</Typography>
                    <NextLink href='/' passHref legacyBehavior>
                        <Link typography='h4' color='secondary'>
                            Regresar
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    )
}

export default EmptyPage