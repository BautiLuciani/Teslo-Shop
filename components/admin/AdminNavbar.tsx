import { AppBar, Toolbar, Link, Typography, Box, Button } from '@mui/material'
import NextLink from 'next/link'
import { useContext } from 'react'
import { UiContext } from '@/context'

const AdminNavbar = () => {

    /* Extraemos toogleSideMenu de UiContext para cambiar el valor del isMenuOpen al clickear en 'menu' */
    const { toggleSideMenu } = useContext(UiContext)

    return (
        <AppBar>
            <Toolbar>
                <NextLink href={'/'} passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                {/* flex: 1 toma todo el ancho disponible entre un elemento y el otro */}
                <Box flex={1} />

                <Button onClick={toggleSideMenu}>
                    Menu
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default AdminNavbar