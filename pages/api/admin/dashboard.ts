/* Podemos usar el snippet 'nextapi' para crear la estructura */
import { db } from '@/database'
import { Order, Product, User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
    | {
        numberOfOrders: number
        paidOrders: number // isPaid true
        notPaidOrders: number
        numberOfClients: number // role: client
        numberOfProducts: number
        productWithNoInventory: number // 0
        lowInventory: number // productos con 10 o menos
    }
    | { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getAdminData(req, res)

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }
}

const getAdminData = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        await db.connect()
        /* Una forma de optimizar las promesas es de la siguiente manera:
        De esta forma todas las promesas se ejecutan al mismo tiempo y se devuelve la respuesta una vez que hayan terminado todas
        El orden es fundamental, la primera promesa que definamos va a ir con la primera variable que definamos, y asi sucesivamente */
        const [
            numberOfOrders,
            paidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            productWithNoInventory,
            lowInventory
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ isPaid: true }),
            Order.countDocuments({ isPaid: false }),
            User.countDocuments({ role: 'client' }),
            Product.countDocuments(),
            Product.countDocuments({ inStock: 0 }),
            Product.countDocuments({ inStock: { $lte: 10 } })
        ])
        await db.disconnect()

        return res.status(200).json({
            numberOfOrders,
            paidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            productWithNoInventory,
            lowInventory
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Ha ocurrido un error' })
    }
}
