import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context'
import { countries } from '@/utils'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

const SummaryPage = () => {

    /* Usmaos el router para volver a la pagina anterior */
    const router = useRouter()
    /* Usamos el CartContext para obtener la informacion de la direccion en el shippingAddress */
    const { shippingAddress, numberOfItems, createOrder } = useContext( CartContext )

    /* Creamos estos estados para validar la creacion de una orden
    El primer estado va a ser para controlar cuando se hizo click en confirmar orden
    El segundo estado va a ser para mostrar mensaje de error en caso de que no se haya podido crear la orden */
    const [isPosting, setIsPosting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    /* Verificamos de que en las cookies este guardado el nombre. Si no lo esta significa que el usuario manipulo
    las cookies, ya que el campo firstName es obligatorio, entonces a esta altura no podria ser undefined.
    En caso de que la cookie no este guardada lo vamos a redireccionar a la pagina de address */
    useEffect(() => {
      if(!Cookies.get('firstName')){
        router.push('/checkout/address')
      }
    }, [ router ])

    /* Con esta funcion creamos la orden en el back end */
    const onCreateOrder = async()=> {
        setIsPosting(true)

        /* Desetructuramos las propiedades de retorno del createOrder para manejar los errores */
        const { hasError, message } = await createOrder()

        /* En caso de que haya un error volvemos a poner el isPosting en false y mostramos el mensaje */
        if( hasError ){
            setIsPosting(false)
            setErrorMessage(message)
            return
        }

        /* En caso de que todo salga bien lo redireccionamos al message donde esta almacenado el id de la orden */
        router.replace(`/orders/${message}`)
    }

    if ( !shippingAddress ) {
        return <></>;
    }

    const { firstName, lastName, address, address2 = '', zip, city, country, phone } = shippingAddress

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

                        <Box sx={{mt: 3}} display='flex' flexDirection='column'>
                            <Button
                                onClick={ onCreateOrder } 
                                color='secondary' 
                                className='ciruclar-btn' 
                                fullWidth
                                disabled={ isPosting }
                            >
                                Confirmar Orden
                            </Button>

                            <Chip
                                color='error'
                                label={ errorMessage }
                                variant='outlined'
                                /* Un string vacio es conciderado como falso */
                                sx={{ display: errorMessage ? 'flex' : 'none', marginTop: 2}}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage