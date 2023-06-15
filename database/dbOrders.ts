import { IOrder } from "@/interface"
import { isValidObjectId } from "mongoose"
import { db } from "."
import { Order } from "@/models"

/* Creamos la funcion para obtener una orden por su id */
export const getOrderById = async( id: string ):Promise<IOrder | null>=> {
    /* Validamos de que el id sea un id valido de mongoose, si no lo es retornamos null */
    if( !isValidObjectId(id) ){
        return null
    }

    /* Intentamos obtener una orden por su id */
    await db.connect()
    const order = await Order.findById( id ).lean()
    await db.disconnect()

    /* En caso de que no exista una orden con ese id retornamos null */
    if( !order ){
        return null
    }

    /* TODO: un procesamiento de las imagenes cuando las subamos al server */
    order.orderItems = order.orderItems.map(product => {
        product.image = product.image.includes('http')
            ? product.image
            : `${process.env.NEXTAUTH_URL}/products/${product.image}`;
        return product;
    });

    /* Si todo sale bien retornamos la orden */
    return JSON.parse( JSON.stringify(order) )
}

/* Esta funcion es para obtener todas las ordenes que coincidan con el id del usuario */
export const getOrderByUsers = async( userId: string): Promise<IOrder[]> => {
    /* Validamos de que el id sea un id valido de mongoose, si no lo es retornamos un arreglo vacio */
    if( !isValidObjectId(userId) ){
        return []
    }

    /* Buscamos las ordenes las cuales el usuario coincida con el userId */
    await db.connect()
    const order = await Order.find({ user: userId }).lean()
    await db.disconnect()

    /* Si todo sale bien retornamos la orden */
    return JSON.parse( JSON.stringify(order) )
}