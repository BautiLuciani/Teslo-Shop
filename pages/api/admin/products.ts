/* Podemos usar el snippet 'nextapi' para crear la estructura */
import { db } from '@/database'
import { IProduct } from '@/interface'
import { Product } from '@/models'
import { isValidObjectId } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
// Instalamos y configuramos cloudinary
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '')

type Data =
    | { message: string }
    | IProduct[]
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProduct(req, res)

        case 'PUT':
            return updateProduct(req, res)

        case 'POST':
            return createProduct(req, res)

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }

}

/* Esta funcion nos sirve para obtener todos los productos */
const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect()
    const products = await Product.find().sort({ title: 'asc' }).lean()
    await db.disconnect()

    /* TODO: un procesamiento de las imagenes cuando las subamos al server */
    const updatedProducts = products.map( product => {
        product.images = product.images.map( img => {
            return img.includes('http') ? img : `${process.env.HOST_NAME}/products/${img}`
        })
        
        return product
    })

    return res.status(200).json(updatedProducts)

}

/* Esta funcion nos sirve para actualizar un producto */
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    /* Extraemos el id y las imagenes del req.body para hacer validaciones */
    const { _id = '', images = [] } = req.body as IProduct

    /* Validamos de que el id sea un id valido de mongoose */
    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El id no es valido' })
    }

    /* Validamos de que haya al menos dos imagenes */
    if (images.length < 2) {
        return res.status(400).json({ message: 'Deben haber al menos dos imagenes' })
    }

    // TODO: posiblemente tendremos un localhost:3000/products/images.jpg

    try {
        await db.connect()
        const product = await Product.findById(_id)

        /* Verificamos de que haya un product con ese id */
        if (!product) {
            await db.disconnect()
            return res.status(400).json({ message: 'No existe un producto con ese id' })
        }

        // TODO: eliminar fotos en Cloudinary
        /* Un ejemplo de una url de cloudinary es la siguiente:
        https://res.cloudinary.com/bautistaluciani/image/upload/v1686842851/apfd9lklmaa3xgx19jkm.jpg 
        Para eliminar una imagen solo necesitamos la aprte final de la url, es decir 'apfd9lklmaa3xgx19jkm'
        Osea que si queremos eliminar una imagen necesitamos extraer esa parte de la url 
        Nosotros por parte del front ya creamos la funcion para eliminar la url del arreglo de imagenes, pero no se elimina desde cloudinary
        Entonces, en caso de que la url que le pasemos no se encuentra en el arreglo es porque queremos eliminar esa imagen */
        product.images.forEach( async(image)=> {
            if(!images.includes(image)){
                /* Extreamos la parte de la url que necesitamos 
                Al lastIndexOf le sumamos 1 para que no tenga en cuenta la '/'
                El split nos divide el string en un arreglo, donde la primera posicion va a estar el id que necesitamos y la segunda la extencion de la imagen, extraemos las dos */
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                console.log(fileId);
                
                /* Borramos la imagen de cloudinary */
                await cloudinary.uploader.destroy( fileId )
            }
        })

        /* Actualizamos el producto */
        await product.updateOne(req.body)
        await db.disconnect()
        return res.status(200).json(product)

    } catch (error) {
        console.log(error);
        await db.disconnect()
        return res.status(400).json({ message: 'Revisar la consola del servidor' })
    }

}

/* Esta funcion nos sirve para crear nuevos productos */
const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    /* Extraemos las imagenes del req.body para hacer validaciones */
    const { images = [] } = req.body as IProduct

    /* Validamos de que haya al menos dos imagenes */
    if (images.length < 2) {
        return res.status(400).json({ message: 'Deben haber al menos dos imagenes' })
    }

    // TODO: posiblemente tendremos un localhost:3000/products/images.jpg

    try {
        await db.connect()

        /* Verificamos de que el slug no este repetido
        Aunque esto no es necesario ya que en el modelo de Product especificamos de que el slug debe ser unico */
        const productSlug = await Product.findOne({ slug: req.body.slug })
        if( productSlug ){
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' })
        }

        /* Creamos un nuevo producto y lo guardamos */
        const product = new Product( req.body )
        await product.save()

        await db.disconnect()
        return res.status(201).json(product)
        
    } catch (error) {
        console.log(error);
        await db.disconnect()
        return res.status(400).json({ message: 'Revisar la consola del servidor' })
    }

}