/* Podemos usar el snippet 'nextapi' para crear la estructura */
import { db } from '@/database'
import { IUser } from '@/interface'
import { User } from '@/models'
import { isValidObjectId } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
    | { message: string }
    | IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers(req, res)

        case 'PUT':
            return updateUser(req, res)

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }

}

/* Con esta funcion obtenemos los usuarios */
const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect()
    const users = await User.find().select('-password').lean()
    await db.disconnect()

    return res.status(200).json( users )
}

/* Con esta funcion actualizamos el rol de los usuarios */
const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    /* Extraemos el userId y el role del req.body */
    const { userId = '', role = ' '} = req.body

    /* Validamos de que el userId sea un id valido de mongoose */
    if(!isValidObjectId(userId)){
        return res.status(400).json({ message: 'No existe usuario por ese id' })
    }

    /* Validamos de que el rol sea un rol valido */
    const validRoles = ['admin', 'client', 'SEO', 'super-user']
    if(!validRoles.includes(role)){
        return res.status(400).json({ message: 'El rol no es valido' })
    }

    /* Obtenemos el usuario a traves su id para modificar el rol */
    await db.connect()
    const user = await User.findById(userId)

    /* Si el usuario no existe devolvemos un estado 404 */
    if(!user){
        await db.disconnect()
        return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    /* Si el usuario existe le modificamos el rol */
    user.role = role
    await user.save()
    await db.disconnect()

    return res.status(200).json({ message: 'Usuario actualizado' })
}
