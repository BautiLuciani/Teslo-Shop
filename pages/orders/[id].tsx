import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { dbOrders } from '@/database'
import { IOrder } from '@/interface'
import { countries } from '@/utils'
import { PayPalButtons } from "@paypal/react-paypal-js";
import { OrderResponseBody } from '@paypal/paypal-js'
import { tesloApi } from '@/api'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

    /* Vamos a usar el useRouter para recargar la pagina al hacer el pago */
    const router = useRouter()

    /* Este estado sirve para saber si el pago se esta haciendo o no, y con eso mostrar el logo de carga */
    const [isPaying, setIsPaying] = useState(false)

    const { shippingAddress } = order

    /* Creamos una funcion para obtener los datos de la orden pagada */
    /* Para la interfaz debemos installar yarn add @paypal/react-paypal-js @paypal/paypal-js */
    const onOrderDetails = async (details: OrderResponseBody) => {
        /* Verificamos que el estado del pago sea 'COMPLETED', caso contrario nos retiramos de la funcion */
        if (details.status !== 'COMPLETED') {
            return console.log('No hay pago de paypal');
        }

        setIsPaying(true)

        /* En caso de que el estado del pago sea 'COMPLETED' vamos a usar la funcion que creamos anteriormente por parte del back */
        try {
            const { data } = await tesloApi.post('/orders/pay', {
                transactionId: details.id,
                orderId: order._id
            })

            /* Aca no hay que setear isPaying en false ya que al recargar la pagina va a volver a su estado inicial que es false */
            router.reload()

        } catch (error) {
            setIsPaying(false)
            console.log(error);
        }
    }

    return (
        <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
            <Typography variant='h1' component='h1'>Orden: {order._id}</Typography>

            {
                order.isPaid
                    ? <Chip
                        sx={{ mt: 2 }}
                        label='Orden ya fue pagada'
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined />}
                    />
                    : <Chip
                        sx={{ mt: 2 }}
                        label='Pendiente de pago'
                        variant='outlined'
                        color='error'
                        icon={<CreditCardOffOutlined />}
                    />
            }

            <Grid container sx={{ mt: 2 }} className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    {/* CartList */}
                    <CartList editable={false} products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>{`Resumen (${order.numberOfItems} Productos)`}</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                            </Box>

                            <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                            <Typography>{shippingAddress.address} {shippingAddress.zip}</Typography>
                            <Typography>{shippingAddress.address2}</Typography>
                            <Typography>{shippingAddress.city}, {countries.find(c => c.code === shippingAddress.country)?.name}</Typography>
                            <Typography>{shippingAddress.phone}</Typography>
                            <Divider sx={{ my: 1 }} />

                            {/* Order Summary */}
                            <OrderSummary
                                orderValues={{
                                    numberOfItems: order.numberOfItems,
                                    subTotal: order.subTotal,
                                    tax: order.tax,
                                    total: order.total
                                }}
                            />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                {/* Mostramos el logo de carga mientras se paga la orden */}
                                <Box
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                    justifyContent='center'
                                >
                                    <CircularProgress />
                                </Box>

                                <Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}>
                                    {
                                        order.isPaid
                                            ? <Chip
                                                sx={{ mt: 2 }}
                                                label='Orden ya fue pagada'
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                            : (
                                                /* Agregamos el boton para pagar con Paypal
                                                Todo esto ya viene de la libreria que instalamos */
                                                <PayPalButtons
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            purchase_units: [
                                                                {
                                                                    amount: {
                                                                        value: `${order.total}`,
                                                                    },
                                                                },
                                                            ],
                                                        });
                                                    }}
                                                    onApprove={(data, actions) => {
                                                        return actions.order!.capture().then((details) => {
                                                            onOrderDetails(details)
                                                        });
                                                    }}
                                                />
                                            )
                                    }
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

/* Utilizamos SSR para que si la orden no pertenece al usuario loggeado ni se muestre la pantalla */
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {

    /* Extraemos el id de la url, para eso usamos query. Recordemos que query lo desestructuramos de ctx */
    const { id = '' } = query

    /* Verificamos de que el usuario este loggeado. Para eso usamos el metodo getServerSession() */
    const session: any = await getServerSession(req, res, authOptions)

    /* session nos devuelve un [object Object] por eso lo trabajamos de la siguiente manera y extraemos user */
    const { user } = JSON.parse(JSON.stringify(session))

    /* En caso de que no haya una session lo redirijimos a la pagina del login. Recordemos que hay que poner
    el id en el query para que despues de loggearse lo vuelva a redirijir a esta misma pagina */
    if (!user) {
        return {
            redirect: {
                destination: `/auth/login?p=${id}`,
                permanent: false
            }
        }
    }

    /* Verificamos si existe una orden que coincida con el id
    Para eso tuvimos que haber creado la funcion en database
    Al id lo pasamos a string porque sino lo puede tomar como un arreglo de strings */
    const order = await dbOrders.getOrderById(id.toString())

    /* En caso de que la orden no exista lo vamos a redirijir a la pagina del historial de ordenes */
    if (!order) {
        return {
            redirect: {
                destination: '/order/history',
                permanent: false
            }
        }
    }

    /* Verificamos que el usuario coincida con el usuario que creo la orden */
    if (order.user !== user.id) {
        return {
            redirect: {
                destination: '/order/history',
                permanent: false
            }
        }
    }

    return {
        /* En caso de que pasen todas las validaciones retornamos la orden */
        props: {
            order
        }
    }
}

export default OrderPage