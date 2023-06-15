import { db } from '@/database'
import { IProduct } from '@/interface'
import { Product } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
    | { message: string }
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res)

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }
}

/* Creamos la funcion para obtener un producto por su slug */
const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect()
    /* Obtenemos el slug de la url con req.query */
    const { slug } = req.query
    const product = await Product.findOne({ slug }).lean()
    await db.disconnect()

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }

    /* TODO: un procesamiento de las imagenes cuando las subamos al server */
    product.images = product.images.map( img => {
        return img.includes('http') ? img : `${process.env.HOST_NAME}/products/${img}`
    })

    return res.status(200).json(product)
}
