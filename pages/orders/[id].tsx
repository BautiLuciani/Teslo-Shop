import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import NextLink from 'next/link'

const OrderPage = () => {
    return (
        <ShopLayout title='Resumen de orden 1562696' pageDescription='Resumen de la orden'>
            <Typography variant='h1' component='h1'>Orden: ABC1234</Typography>

            {/* <Chip
            sx={{mt: 2}}
            label='Pendiente de pago'
            variant='outlined'
            color='error'
            icon={<CreditCardOffOutlined/>}
            /> */}

            <Chip
                sx={{ mt: 2 }}
                label='Orden ya fue pagada'
                variant='outlined'
                color='success'
                icon={<CreditScoreOutlined />}
            />

            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12} sm={7}>
                    {/* CartList */}
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen (3 Productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>Bautista Luciani</Typography>
                            <Typography>Talar del lago 2, lote 181</Typography>
                            <Typography>Av. General Pacheco 3188</Typography>
                            <Typography>Buenos Aires, Argentina</Typography>
                            <Typography>+54 9 11 3782-5307</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref legacyBehavior>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            {/* Order Summary */}
                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                {/* Todo */}
                                <h1>Pagar</h1>
                                <Chip
                                    sx={{ mt: 2 }}
                                    label='Orden ya fue pagada'
                                    variant='outlined'
                                    color='success'
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default OrderPage