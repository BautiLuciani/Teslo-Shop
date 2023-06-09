/* Podemos usar el snippet 'react-context' creado por nosotros */
import { ICartProduct, IShippingAddress } from '@/interface'
import { createContext } from 'react'

interface ContextProps {
    isLoaded: boolean,
    cart: ICartProduct[],
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number,

    shippingAddress?: IShippingAddress
    
    // Metodos
    addProductCart: (product: ICartProduct) => void,
    updateCartQuantity: (product: ICartProduct) => void,
    removeCartProduct: (product: ICartProduct) => void,
    updateAddress: (address: IShippingAddress) => void

    // Orders
    createOrder: () => Promise<{ hasError: boolean, message: string}>
}

export const CartContext = createContext({} as ContextProps)