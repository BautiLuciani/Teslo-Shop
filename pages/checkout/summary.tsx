import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context'
import { countries } from '@/utils'
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

const SummaryPage = () => {

    /* Usmaos el router para volver a la pagina anterior */
    const router = useRouter()
    /* Usamos el CartContext para obtener la informacion de la direccion en el shippingAddress */
    const { shippingAddress, numberOfItems } = useContext( CartContext )

    /* Verificamos de que en las cookies este guardado el nombre. Si no lo esta significa que el usuario manipulo
    las cookies, ya que el campo firstName es obligatorio, entonces a esta altura no podria ser undefined.
    En caso de que la cookie no este guardada lo vamos a redireccionar a la pagina de address */
    useEffect(() => {
      if(!Cookies.get('firstName')){
        router.push('/checkout/address')
      }
    }, [ router ])

    const { firstName, lastName, address, address2 = '', zip, city, country, phone } = shippingAddress!

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden del usuario'>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>
        <Grid container sx={{mt: 2}}>
            <Grid item xs={12} sm={7}>
                {/* CartList */}
                <CartList/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                        <Divider sx={{my: 1}}/>

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de entrega</Typography>
                            <NextLink href='/checkout/address' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography>{firstName} {lastName}</Typography>
                        <Typography>{address} {address2 && `, ${address2}`} {zip}</Typography>
                        <Typography>{city}, {countries.find( c => c.code === country)?.name}</Typography>
                        <Typography>{phone}</Typography>
                        <Divider sx={{my: 1}}/>

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        {/* Order Summary */}
                        <OrderSummary/>

                        <Box sx={{mt: 3}}>
                            <Button color='secondary' className='ciruclar-btn' fullWidth>
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

export default SummaryPage