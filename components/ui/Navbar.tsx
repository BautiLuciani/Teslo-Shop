import { AppBar, Toolbar, Link, Typography, Box, Button, IconButton, Badge, Input, InputAdornment } from '@mui/material'
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { CartContext, UiContext } from '@/context'

const Navbar = () => {

    /* Utilizamos el useRouter para obtener la ruta en que nos encontramos 
    Si extraemos el asPath nos devuelve la url exacta en la que nos encontramos
    Podemos usar este asPath para generar un ternario y que se muestre activa la categoria que nos encontramos*/
    /* Ademas podemos extraer tambien el push, esto se puede usar para redirijir al usuario a la pagina que querramos */
    const { asPath, push } = useRouter()

    /* Extraemos toogleSideMenu de UiContext para cambiar el valor del isMenuOpen al clickear en 'menu'' */
    const { toggleSideMenu } = useContext(UiContext)
    /* Extraemos el numberOfItems para mostrarlo en el badgeContent del carrito */
    const { numberOfItems } = useContext(CartContext)

    /* Usamos este estado para mostrar el input cuando el usuario quiere buscar o mostrar la lupita en caso de que el usuario no este buscando nada */
    const [isSearching, setIsSearching] = useState(false)
    /* Creamos este state para controlar lo que el usuario escribe en el input para buscar un producto */
    const [searchTerm, setSearchTerm] = useState('')

    /* Creamos la funcion para redirijir al usuario con lo que busco */
    const onSearchTerm = () => {
        if(searchTerm.trim().length === 0) return
        push(`/search/${searchTerm}`)
    }

    return (
        <AppBar>
            <Toolbar>

                {/* Es importante colocar el legacyBehavior para evitar errores */}
                <NextLink href={'/'} passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                {/* flex: 1 toma todo el ancho disponible entre un elemento y el otro */}
                <Box flex={1} />

                {/* Box es equivalente a un div, con la ventaja de que se le puede aplicar el theme
                Ademas podemos usar sx el cual no facilita la aplicacion de estilos */}
                {/* En caso de que el usuario este buscando algo las opciones deberian desaparecer
                Ademas si la pantalla es muy chica las opciones tambien deberian desaparecer */}
                <Box sx={{ display: isSearching ? 'none' : { xs: 'none', sm: 'block' } }}>
                    <NextLink href='/category/men' passHref legacyBehavior>
                        <Link>
                            {/* Generamos un ternario para que se muestre activo el boton en caso de que nos encontremos en la categoria de hombres
                        Lo mismo hacemos cone le resto de las categorias */}
                            <Button color={asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women' passHref legacyBehavior>
                        <Link>
                            <Button color={asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid' passHref legacyBehavior>
                        <Link>
                            <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />

                {/* Los iconos de MUI suelen ir dentro de la etiqueta IconButton */}
                {/* Icono para pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    /* En pantallas chicas al tocar en el icono se va a abrir el sidemenu */
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                {/* Icono para pantallas grandes */}
                {
                    isSearching
                        ? (
                            <Input
                                /* Cuando la pantalla es muy chica no se debe mostrar */
                                sx={{ display: {xs: 'none', sm: 'flex'}}}
                                /* Con el autofocus vamos a poder escribir directo en el input cuando se abra el sidebar */
                                autoFocus
                                className='fadeIn'
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                /* Utilizamos el onKeyUp para que al apretar enter se ejecute la funcion onSearchTerm() */
                                onKeyUp={e => e.key == 'Enter' ? onSearchTerm() : null}
                                type='text'
                                placeholder="Buscar..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={()=>setIsSearching(false)}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                onClick={()=>setIsSearching(true)}
                                className='fadeIn'
                                /* En pantallas pequeñas no se deberia mostrar */
                                sx={{ display: {xs: 'none', sm: 'flex'}}}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }

                <NextLink href='/cart' passHref legacyBehavior>
                    <Link>
                        <IconButton>
                            {/* Badge coloca los numeros arriba del carrito */}
                            <Badge badgeContent={ numberOfItems < 10 ? numberOfItems : '+9' } color='secondary'>
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>
                {/* Usamos el onClick para cambiar el valor del isMenuOpen */}
                <Button
                    onClick={toggleSideMenu}
                >
                    Menu
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar