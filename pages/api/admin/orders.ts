/* Podemos usar el snippet 'nextapi' para crear la estructura */
import { db } from '@/database'
import { IOrder } from '@/interface'
import { Order } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
    | { message: string }
    | IOrder[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getOrders(req, res)
    
        default:
            return res.status(400).json({ message: 'Bad Request'})
    }

}

const getOrders = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect()
    const orders = await Order.find()
        /* Con sort lo que hacemos es ordenar las ordenes por lo que le especifiquemos, en este caso por su fecha de creacion */
        .sort({ createdAt: 'desc'})
        /* Con el populate hace referencia al objeto con el cual queremos hacer el join, en este caso user
        Es importante ver como tenemos definido user en el Order (models)
        Hay que pasarle dos parametros, el atributo con el que queremos hacer el join y las propiedades que queremos extraer de ese parametro  */
        .populate('user', 'name email')
        .lean()
    await db.disconnect()

    return res.status(200).json( orders )
}
