/* Podemos usar el snippet 'nextapi' para crear la estructura */
import { db } from '@/database'
import { User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '@/utils';

type Data = 
    | { message: string }
    | {
        token: string,
        user: {
            name: string,
            email: string,
            role: string
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return registerUser(req, res)
    
        default:
            res.status(400).json({message: 'Bad Request'})
    }

}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    /* Si queremos podemos definir el tipo de los datos */
    const {name = '', email = '', password = ''} = req.body as {name: string, email: string, password: string}

    /* Verificamos que el nombre tenga al menos dos caracteres */
    if(name.length < 2){
        return res.status(400).json({message: 'El nombre debe ser de al menos dos caracteres'})
    }

    /* Verificamos que la contraseña tenga al menos seis caracteres */
    if(password.length < 6){
        return res.status(400).json({message: 'La contraseña debe ser de al menos seis caracteres'})
    }

    /* Verificamos que el email sea un email valido */
    if( !validations.isValidEmail( email )){
        res.status(400).json({message: 'El correo no es valido'})
    }

    await db.connect()
    const user = await User.findOne({email})
    await db.disconnect()

    /* Verificamos que el mail enviado no coincida con alguno ya existente */
    if( user ){
        return res.status(400).json({message: 'Este correo ya existe'})
    }

    /* Definimos un nuevo usuario */
    /* El User debe ser de los models */
    const newUser = new User({
        name,
        email: email.toLowerCase(),
        /* Encriptamos la contraseña */
        password: bcrypt.hashSync( password ),
        role: 'client'
    })

    /* Hacemos un try y un catch para validar de que el nuevo usuario se haya guardado correctamente */
    try {
        await newUser.save({validateBeforeSave: true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Revisar logs del servidor'})
    }

    /* Extraemos el id y el rol del newUser */
    const {_id, role} = newUser

    /* Generamos el token */
    const token = jwt.signToken(_id, email)

    return res.status(200).json({
        token,
        user: {
            name,
            email,
            role
        }
    })
}
