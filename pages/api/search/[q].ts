import { db } from '@/database'
import { IProduct } from '@/interface'
import { Product } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
    | { message: string }
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
        switch (req.method) {
            case 'GET':
                return searchProducts(req, res)

            default:
                res.status(400).json({message: 'Bad Request'})
        }
}

/* Creamos la funcion para obtener productos cuando la busqueda del usuario coincida con su title o tags */
const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    /* Obtenemos el parametro q de la url con req.query
    Extraemos 'q' porque fue el nombre que le pusimos al archivo */
    let {q = ''} = req.query

    if(q.length === 0){
        res.status(400).json({message: 'Debe de especificar el query de busqueda'})
    }

    /* Pasamos q a minuscula ya que los tags se encuentran todos en minuscula */
    q = q.toString().toLowerCase()

    await db.connect()
    /* Para la condicion debemos crear un indice que nos ayude a buscar el 'q' entre los titulos y los tags
    Para eso debemos crear el indice en el archivo models/Products.ts 
    Una vez definidos los atributos donde queremos buscar, los cuales los definimos con el inidice 'text',
    podemos hacer la busqueda dentro del find() utilizando el signo '$' de la siguiente manera */
    const products = await Product.find({$text: {$search: q}}).select('title images price inStock slug -_id').lean()
    await db.disconnect()

    res.status(200).json(products)
}

