/* Podemos usar el snippet 'react-context-reducer' creado por nosotros */
import { ICartProduct } from '@/interface';
import { CartState, ShippingAddress } from './';

type CartActionType =
    | { type: 'Cart - LoadCart from cookies | storage', payload: ICartProduct[] }
    | { type: 'Cart - LoadAddress from cookies', payload: ShippingAddress }
    | { type: 'Cart - Update Address', payload: ShippingAddress }
    | { type: 'Cart - Add Product', payload: ICartProduct[] }
    | { type: 'Cart - Update Quantity Product', payload: ICartProduct }
    | { type: 'Cart - Remove product in cart', payload: ICartProduct }
    | {
        type: 'Cart - Update order summary',
        payload: {
            numberOfItems: number,
            subTotal: number,
            tax: number,
            total: number
        }
    }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
    switch (action.type) {
        case 'Cart - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: action.payload
            }

        /* Cuando dos funciones tienen el mismo procedimiento se puede escribir de la siguiente manera */
        case 'Cart - Update Address':
        case 'Cart - LoadAddress from cookies':
            return {
                ...state,
                shippingAddress: action.payload
            }

        case 'Cart - Add Product':
            return {
                ...state,
                /* Nivel 1 */
                /* cart: [...state.cart, action.payload] */

                /* Nivel 2 */
                /* cart: [...action.payload] */

                /* Nivel 3 */
                cart: [...action.payload]
            }

        case 'Cart - Update Quantity Product':
            return {
                ...state,
                /* Lo recomendable es no manejar las funciones desde el reducer,
                pero lo podemos hacer si la funcion no requiere de librerias externas y lo resolvemos todo aca */
                cart: state.cart.map(prod => {
                    /* Si el producto no coincide id no es el que quiero modificar, asi que lo retorno como esta */
                    if (prod._id !== action.payload._id) return prod
                    /* Si el producto coincide id pero no la misma talla no es el que quiero modificar, asi que lo retorno como esta */
                    if (prod.size !== action.payload.size) return prod

                    /* Si el producto coincide id y talla es el que quiero modificar
                    Otra opcion pudo haber sido retornar el action.payload ya que es el que tiene el nuevo valor de la cantidad pero me parece mas facil entenderlo de esta manera */
                    prod.quantity = action.payload.quantity
                    return prod

                })
            }

        case 'Cart - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter(prod => (
                    /* Buscamos el producto que tenga el mismo id y la misma talla,
                    y es ese producto el que no queremos devolver por eso lo negamos con ! */
                    !(prod._id === action.payload._id && prod.size === action.payload.size)
                ))

                /* Otra manera de hacerlo podria ser la siguiente */
                /* cart: state.cart.filter( prod => {
                    if(prod._id === action.payload._id && prod.size === action.payload.size){
                        return false
                    }
                    return true
                }) */
            }

        case 'Cart - Update order summary':
            return {
                ...state,
                ...action.payload
            }

        default:
            return state;
    }
}