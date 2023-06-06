import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'

const CartPage = () => {

    /* Vamos a usar el CartContext para extraer isLoaded y el cart para verificar si hay productos en el carrito
    Para esto tuvimos que agregar la propiedad isLoaded la cual nos dice si el carrito ya fue cargado o no */
    const { isLoaded, cart } = useContext(CartContext)
    /* Vamos a usar el router para mostrar la pagina de carrito vacio */
    const router = useRouter()

    /* Vamos a usar el useEffect para mostrar la pagina del carrito vacio en caso de que no haya ningun producto */
    useEffect(() => {
        if (isLoaded && cart.length === 0) {
            router.replace('/cart/empty')
        }
    }, [isLoaded, cart, router])

    /* Puede que tarde un segundo en cargar la logica de arriba y por mas que el carrito esta vacio, por un
    segundo muestra el return de abajo. Para evitar eso creamos este condicional el cual muestra la pagina
    en blanco hasta que termine de cargar la logica de arriba */
    if (!isLoaded || cart.length === 0){
        return (<></>)
    }

    return (
        <ShopLayout title='Carrito - 3' pageDescription='Carrito de compras de la tienda'>
            <Typography variant='h1' component='h1'>Carrito</Typography>
            <Grid container>
                <Grid item xs={12} sm={7}>
                    {/* CartList */}
                    <CartList editable />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{ my: 1 }} />

                            {/* Order Summary */}
                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button 
                                    color='secondary' 
                                    className='ciruclar-btn' 
                                    fullWidth
                                    href='/checkout/address'
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default CartPage