import { ISize } from "./products"
import { IUser } from "./user"

export interface IOrder {
    /* El id es opcional porque puede ser que en un momento lo tengamos y en otro momento no */
    _id?: string
    /* Los usuarios tambien son opcionales, y pueden ser de tipo IUser para que tenga todos los atributos
    de un usuario pero tambien puede ser un string por si lo queremos identificar por su id */
    user?: IUser | string
    /* orderItem es un arreglo de los productos que van a estar en las ordenes */
    orderItems: IOrderItem[]
    shippingAddress: IShippingAddress
    paymentMethod?: string

    /* Se necesitan estas propiedades para compararlas con el back end y asegurarnos de que no fueron manipuladas */
    numberOfItems: number
    subTotal: number
    tax: number
    total: number

    /* Tenemos que saber si se hizo el pago y en que momento */
    isPaid: boolean
    paidAt?: string

    /* Relacion entre la orden y el gestor de pago */
    transactionId?: string
}

/* Definimos los atributos de los productos que van a estar en las ordenes */
export interface IOrderItem {
    _id: string
    title: string
    size: ISize
    quantity: number
    slug: string
    image: string
    price: number
    gender: string
}

/* Definimos los atributos de la direccion que va a estar en las ordenes */
export interface IShippingAddress {
    firstName: string
    lastName: string
    address: string
    address2?: string
    zip: string
    city: string
    country: string
    phone: string
}