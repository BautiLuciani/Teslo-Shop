import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props {
    currentValue: number,
    maxValue: number

    // Metodos
    onUpdateQuantity: (quantity: number)=> void
}

const ItemCounter: FC<Props> = ({currentValue, maxValue, onUpdateQuantity}) => {
    return (
        <Box display='flex' alignItems='center'>
            <IconButton
                onClick={()=> (currentValue > 1) && onUpdateQuantity(currentValue - 1)}
            >
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
            <IconButton
                onClick={()=> (currentValue <= maxValue) && onUpdateQuantity(currentValue + 1)}
            >
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}

export default ItemCounter