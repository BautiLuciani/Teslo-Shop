/* Podemos usar el snippet 'nextapi' para crear el esqueleto */
import { db, seedDatabase } from '@/database'
import { Product, User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if(process.env.NODE_ENV === 'production'){
        return res.status(401).json({message: 'No tiene acceso a este servicio'})
    }

    await db.connect()
    /* Borramos cualquier cosa que haya quedado en la base de datos por las dudas */
    /* En este caso porque tenemos solo Product, pero si tuvieramos mas modelos tambien habria que borrar esos */
    await Product.deleteMany()
    /* Insertamos todos los productos a la base de datos */
    await Product.insertMany( seedDatabase.initialData.products )

    /* Insertamos los usuarios de prueba a la base de datos */
    /* Recordemos que los usuarios deben ser importados de models */
    await User.deleteMany()
    await User.insertMany( seedDatabase.initialData.users )

    await db.disconnect()

    res.status(200).json({ message: 'Proceso realizado correctamente' })
}