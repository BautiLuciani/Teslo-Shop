import { User } from "@/models"
import { db } from "."
import bcrypt from 'bcryptjs';

export const checkUserEmailAndPassword = async(email: string, password: string)=> {

    await db.connect()
    const user = await User.findOne({email}).lean()
    await db.disconnect()

    /* Si no existe un usuario con ese mail retornamos null */
    if(!user){
        return null
    }

    /* Si existe un usuario con ese mail pero las contraseñas no coinciden retornamos null */
    if(!bcrypt.compareSync(password, user.password!)){
        return null
    }

    /* En caso de que el mail y la contraseña coincidan con un usuario de la base de datos, 
    extraemos la informacion y la retornamos */
    const {name, role, _id} = user

    return {
        id: _id,
        name,
        email: email.toLocaleLowerCase(),
        role
    }
}

/* Esta funcion crea o verifica el usuario de OAuth */
export const checkOAuthUser = async( oAuthEmail: string, oAuthName: string )=> {
    
    await db.connect()
    const user = await User.findOne({ email: oAuthEmail })

    /* En caso de que el usuario exista en la base de datos extraemos su informacion */
    if(user){
        await db.disconnect()
        const { _id, email, name, role } = user
        return { _id, email, name, role}
    }

    /* En caso de que no exista creamos un nuevo usuario */
    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client'})
    /* Guardamos el nuevo usuario en DB */
    await newUser.save()
    await db.disconnect()

    /* Extraemos los datos del nuevo usuario y los retornamos */
    const { email, name, password, role } = newUser
    return {
        email,
        name,
        password,
        role
    }
}
