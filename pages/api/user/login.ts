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
        case 'POST':
            return loginUser(req,res)
    
        default:
            res.status(400).json({message: 'Bad request'})
    }

}

const loginUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    /* Necesitamos extraer el email y contraseña que mando el usuario
    Lo extraemos del req.body */
    const {email = '', password = ''} = req.body

    await db.connect()
    /* El user lo debemos importar de models */
    /* Verificamos si existe un usuario con el email que se mando en el body */
    const user = await User.findOne({email})
    await db.disconnect()

    /* En caso de que el mail enviado no coincida con la base de datos devolvemos un status 400 */
    if(!user){
        return res.status(400).json({message: 'El email no es valido'})
    }

    /* Utilizamos el metodo compareSync de bcrypt para comparar si la contraseña enviada y la constraseña que esta en la base de datos coincide */
    /* En caso de que la contraseña enviada no coincida con la base de datos devolvemos un status 400 */
    if(!(bcrypt.compareSync(password, user?.password!))){
        return res.status(400).json({message: 'La contraseña no es valida'})
    }

    /* Si llego hasta aca es porque tanto el email como la contraseña coinciden */
    /* Extraemos el nombre y el rol del usuario, tambien el _id para generar el token */
    const {name, role, _id} = user!

    const token = jwt.signToken(_id, email)

    return res.status(200).json({
        token,
        user: {
            email,
            name,
            role
        }
    })
}
