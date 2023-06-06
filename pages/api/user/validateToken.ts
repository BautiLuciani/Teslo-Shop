/* Podemos usar el snippet 'nextapi' para crear la estructura */
import { db } from '@/database'
import { User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { jwt } from '@/utils';

type Data = 
    | { message: string }
    | { 
        token: string,
        user: {
            name: string
            email: string
            role: string
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return validateJWT(req,res)
    
        default:
            res.status(400).json({message: 'Bad request'})
    }

}

const validateJWT = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    /* Necesitamos extraer el token
    Lo podemos extraer tanto del req.header como del req.cookies
    Depende desde donde queremos mandar el token, en este caso va a ser desde las cookies */
    const { token = '' } = req.cookies

    /* Verificamos si el token es un token permitido */
    /* Para eso creamos una funcion en utils/jwt.ts */
    let userId = ''

    try {
        /* El isValidToken va a retornar el id que esta registrado dentro del token */
        userId = await jwt.isValidToken( token )
    } catch (error) {
        return res.status(401).json({message: 'Token de autorizacion no valido'})
    }

    await db.connect()
    const user = await User.findById( userId ).lean()
    await db.disconnect()

    /* En el caso que el _id no coincida con algun usuario nos devuelve un status 400 */
    if(!user){
        return res.status(400).json({message: 'No existe ususario con ese id'})
    }

    /* Extraemos los datos del usuario */
    const {name, role, email, _id} = user

    return res.status(200).json({
        token: jwt.signToken(_id, email),
        user: {
            name,
            email,
            role
        }
    })
}