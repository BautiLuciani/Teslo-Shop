import { SHOP_CONSTANTS, db } from '@/database'
import { IProduct } from '@/interface'
import { Product } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
    | { message: string }
    | IProduct[] /* Tiene que ser un arreglo ya que el getProducts retorna mas de un producto */

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    /* Definimos que retornar en base al metodo del pedido que se le hace la a API */
    switch (req.method) {
        case 'GET':
            return getProducts(req, res)
    
        default:
            return res.status(400).json({ message: 'Bad Request' })
    }
}

/* Creamos la funcion para devolver los productos 
Dentro de esta funcion tambien vamos a filtrar por genero */
const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    /* Extraemos el gender de la url, en caso de que no haya su valor va a ser all */
    const { gender = 'all' } = req.query

    let genero = {}
    /* Creamos los valores posibles del genero en el archivo database/constants.ts
    Con esto evitamos que los usuarios pasen cualquier valor como parametro del gender */
    if(gender !== 'all' && SHOP_CONSTANTS.generosValidos.includes(`${gender}`)){
        genero = {gender}
    }

    await db.connect()
    /* Podemos usar el find para filtrar por genero */
    /* Con el select definimos que campos en especifico queremos.
    En caso de no querer un campo que se agrega automaticamente (con el _id) hay que ponerle un - antes */
    /* El lean nos filtra metodos que no necesitamos */
    const products = await Product.find(genero).select('title images price inStock slug -_id').lean()
    await db.disconnect()

    /* Si no especificamos el estado por defecto va a ser 200 */
    /* Debemos especificar el tipo de products en el type Data, en este caso es de tipo IProduct */
    return res.status(200).json( products )
}