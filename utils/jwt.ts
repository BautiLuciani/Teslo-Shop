import jwt from 'jsonwebtoken'

/* Creamos esta funcion para generar el jwt */
export const signToken = (_id: string, email: string)=> {
    /* Creamos una palabara semilla, la cual si alguien la obtienen podria comprometer todos nuestros tokens
    La vamos a crear en el archivo '.env' para tener un mejor control de ella */

    /* Verificamos que se haya creado la palabra semilla, caso contrario lanzamos un error para que la creen */
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('No hay palabra semilla de JWT - Crear una en la variable de entorno')
    }

    /* Para generar un nuevo JWT utilizamos el metodo sign el cual necesita tres parametros */
    return jwt.sign(
        // Payload
        // El payload es la informacion que vamos a almacenar dentro del token
        // En el payload no puede ir informacion sensible como tarjetas de credito o contraseñas
        {_id, email},

        // secretOrPrivateKey
        // Es la llave secreta que creamos en la variable de entorno
        process.env.JWT_SECRET_SEED,

        // Opciones
        // En este caso vamos a usar las opciones para darle una vigencia al token
        { expiresIn: '30d' }
    )
}

/* Creamos la funcion para validar el token
Va a devolver una promesa de tipo string, porque sabemos que va a devolver el _id que se encuentra dentro del token */
export const isValidToken = ( token: string ):Promise<string>=> {
    /* Verificamos que se haya creado la palabra semilla, caso contrario lanzamos un error para que la creen */
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('No hay palabra semilla de JWT - Crear una en la variable de entorno')
    }

    /* Verificamos que el token tenga una longitud mayor a 10 */
    if( token.length <= 10 ) {
        return Promise.reject('JWT no es valido')
    }

    return new Promise( (resolve, reject) => {

        try {
            /* Verificamos el token con el metodo verify()
            El mismo requiere 3 parametros */
            jwt.verify(
                // Token
                token,

                // secretOrPrivateKey
                // Puede que no este definida por eso ante la duda es un string vacio
                process.env.JWT_SECRET_SEED || '',

                // Callback
                (err, payload) => {
                    // Si hay un error es porque el jwt no es valido
                    if( err ) return reject('JWT no es valido')
                    // Si no hay un error es porque el jwt es valido
                    // Extraemos del payload lo que queramos del token, en este caso tenemos el _id y el email, pero solo necesitamos el _id
                    const { _id } = payload as {_id: string}
                    // Si todo sale bien la funcion regresa el _id del usuario
                    resolve(_id)
                }
            )
        } catch (error) {
            reject('JWT no es valido')
        }
    } )
}