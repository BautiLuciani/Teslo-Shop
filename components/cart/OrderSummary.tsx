import { CartContext } from '@/context'
import { currency } from '@/utils'
import { Grid, Typography } from '@mui/material'
import React, { FC, useContext } from 'react'

interface Props {
    orderValues?: {
        numberOfItems: number,
        subTotal: number,
        tax: number,
        total: number
    }
}

const OrderSummary: FC<Props> = ({orderValues}) => {

    const { numberOfItems, subTotal, tax, total } = useContext(CartContext)

    /* Si orderValues no es undefined significa que viene de [id].ts, entonces vamos a usar esos valores
    En caso de que sea undefined vamos a mostrar los valores del cartContext */
    const showOrderValues = orderValues ? orderValues : { numberOfItems, subTotal, tax, total }

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{showOrderValues.numberOfItems} {showOrderValues.numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(showOrderValues.subTotal)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(showOrderValues.tax)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>{currency.format(showOrderValues.total)}</Typography>
            </Grid>
        </Grid>
    )
}

export default OrderSummary