/* Podemos usar el snippet 'react-provider' creado por nosotros */
import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import { CartContext, cartReducer } from './'
import { ICartProduct } from '@/interface'
import Cookies from 'js-cookie'

export interface CartState {
    isLoaded: boolean,
    cart: ICartProduct[],
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number
    shippingAddress?: ShippingAddress
}

export interface ShippingAddress {
    firstName: string,
    lastName: string,
    address: string,
    address2?: string,
    zip: string,
    city: string,
    country: string,
    phone: string
}

const Cart_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

interface Props extends PropsWithChildren<{}> {

}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, Cart_INITIAL_STATE)

    /* En las versiones mas actualizadas de react los useEffect se ejecutan dos veces por el strictMode,
    lo cual esto nos genera un error ya que al ejecutarse dos veces el segundo useEffect el carrito se 
    vacia al refrescar la pagina. Esto en produccion no pasa ya que no existe el strictMode ahi.
    Una solucion es crear un estado en donde almacenamos un booleano y en base a eso ejecutar un effect 
    antes que otro. La otra solucion mas facil (que fue la que hice) es desactivar el strictMode.
    Pero entonces al desactivar el strictMode es importante el orden en el que ponemos los useEffects */
    /* Usamos este useEffect para obtener los productos de las cookies cuando se monta la pagina */
    useEffect(() => {
        /* Creamos un try y catch por si alguien sin autorizacion modifica la cookie desde el front */
        try {
            /* Obtenemos los productos de las cookies */
            const productos = Cookies.get('cart')
            /* Puede que nos retorne un undefined, para manejar esto usamos el ?
            En caso de que no sea undefined nos parsea la informacion, sino nos devuelve un string vacio */
            const carrito = productos ? JSON.parse(productos) : []
            dispatch({ type: 'Cart - LoadCart from cookies | storage', payload: carrito })
        } catch (e) {
            dispatch({ type: 'Cart - LoadCart from cookies | storage', payload: [] })
        }
    }, [])

    useEffect(() => {
        if(Cookies.get('firstName')){
            const shippingAddress = {
                firstName: Cookies.get('firstName') || '',
                lastName: Cookies.get('lastName') || '',
                address: Cookies.get('address') || '',
                address2: Cookies.get('address2') || '',
                zip: Cookies.get('zip') || '',
                city: Cookies.get('city') || '',
                country: Cookies.get('country') || '',
                phone: Cookies.get('phone') || ''
            }
    
            dispatch({type: 'Cart - LoadAddress from cookies', payload: shippingAddress})
        }
    }, [])

    /* Usamos este useEffect para almacenar el carrito en las cookies 
    Este useEffect se va a ejecutar cada vez que haya un cambio en el carrito */
    useEffect(() => {
        /* El carrito al ser un objeto hay que pasarlo a string para almacenarlo en las Cookies */
        Cookies.set('cart', JSON.stringify(state.cart))
    }, [state.cart])

    /* Usamos este useEffect para calcular los montos a pagar
    Este useEffect se va a ejecutar cada vez que haya un cambio en el carrito
    Al tener las mismas dependencias del useEffect anterior podriamos ejecutar la logica ahi,
    pero react nos recomienda que cada useEffect se ocupe de una tarea en especifico */
    useEffect(() => {
        /* Para contar la cantidad de items vamos a usar una funcion reductora. Reduce recorre todos los elementos de una lista y ejecuta el callback
        Recibe dos parametros, una funcion callback y un valor inicial. A su vez el callback recibe dos parametros, el valorAnterior y el valorInicial.
        Su estrucutura es la siguiente:
        .reduce(funcion callback(valorAnterior, valorActual){
            return ...
        }, valorInicial) */
        const numberOfItems = state.cart.reduce((valorAnterior, item) => item.quantity + valorAnterior, 0)

        /* Usamos el metodo reduce para caluclar el precio final de todos los items juntos */
        const subTotal = state.cart.reduce((valorAnterior, item) => (item.quantity * item.price) + valorAnterior, 0)

        /* Definimos el valor de los taxes en el archivo '.env' para poder actualizar rapidamente el valor si el dia de mañana cambia,
        y nos ahorramos tener que revisar todo el codigo para cambiarlo en todos los lugares que lo estamos utilizando
        Sin embargo cuando definimos variables en '.env', sus valores por defecto son string, es por eso que hay que pasarlo a number
        En caso de que no este definido el valor, por defecto va a ser cero */
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
        /* Una vez obtenido el taxRate podemos calcular los taxes de los productos */
        const tax = subTotal * taxRate

        /* Debemos agregar estas mismas propiedades al CartState */
        const orderSummary = {
            numberOfItems,
            subTotal,
            tax,
            total: subTotal + tax
        }

        dispatch({ type: 'Cart - Update order summary', payload: orderSummary })

    }, [state.cart])

    /* Creamos la funcion para agregar productos al carrito */
    const addProductCart = (product: ICartProduct) => {
        /* Hay muchas maneras de resolver esto */
        /* NIVEL 1
        Esta es una solucion basica con la desventaja que no almacena en un mismo arreglo los mismos productos con la misma talla
        dispatch({type: 'Cart - Add Product', payload: product}) */

        /* NIVEL 2 
        Esto funcionaria pero no es la mejor manera para hacerlo
        const productInCart = state.cart.filter(p => p._id !== product._id && p.size !== product.size)
        dispatch({type: 'Cart - Add Product', payload: [...productInCart, product]}) */

        /* NIVEL 3 */
        /* Como debemos retornar un arreglo para el dispatch inicializamos el newCart como un arreglo */
        let newCart = []
        /* Hay que verificar si ya existe un producto con el mismo id, si existe significa que el producto esta repetido.
        Pero que este repetido no significa que sea de la misma talla, por eso tambien hay que verificar eso.
        En caso de que el producto no este repetido ni de id ni de talla, lo vamos a agregar al carrito */
        if (state.cart.find(prod => prod._id === product._id && prod.size === product.size)) {
            /* Recorremos todo los productos que hay en el carrito, verificando cual es el que tiene el mismo id y talla (producto repetido)
            En caso de encontrar cual es el producto le vamos a modificar solo la quantity */
            newCart = state.cart.map(item => {
                if (item._id === product._id && item.size === product.size) {
                    /* Actualizamos la cantidad */
                    item.quantity = item.quantity + product.quantity
                    return item
                }
                /* En caso de que el producto no coincida sigue con el siguiente */
                return item
            })
        } else {
            newCart = [...state.cart, product]
        }

        dispatch({ type: 'Cart - Add Product', payload: newCart })
    }

    /* Creamos la funcion para modificar la cantidad de productos desde el carrito */
    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: 'Cart - Update Quantity Product', payload: product })
    }

    /* Creamos la funcion para eliminar productos desde el carrito */
    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: 'Cart - Remove product in cart', payload: product })
    }

    /* Creamos una funcion para actualizar la direccion del usuario */
    const updateAddress = (address: ShippingAddress)=> {
        Cookies.set('firstName', address.firstName)
        Cookies.set('lastName', address.lastName)
        Cookies.set('address', address.address)
        Cookies.set('address2', address.address2 || '')
        Cookies.set('zip', address.zip)
        Cookies.set('city', address.city)
        Cookies.set('country', address.country)
        Cookies.set('phone', address.phone)

        dispatch({type: 'Cart - Update Address', payload: address})
    }

    return (
        <CartContext.Provider value={{
            ...state,

            // Metodos
            addProductCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress
        }}>
            {children}
        </CartContext.Provider>
    )
}