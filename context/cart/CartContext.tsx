/* Podemos usar el snippet 'react-context' creado por nosotros */
import { ICartProduct } from '@/interface'
import { createContext } from 'react'
import { ShippingAddress } from './'

interface ContextProps {
    isLoaded: boolean,
    cart: ICartProduct[],
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number,

    shippingAddress?: ShippingAddress
    
    // Metodos
    addProductCart: (product: ICartProduct) => void,
    updateCartQuantity: (product: ICartProduct) => void,
    removeCartProduct: (product: ICartProduct) => void,
    updateAddress: (address: ShippingAddress) => void
}

export const CartContext = createContext({} as ContextProps)