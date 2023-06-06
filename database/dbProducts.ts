import { IProduct } from "@/interface";
import { db } from ".";
import { Product } from "@/models";

/* Hay que especificar que retornan las funciones */
export const getProductBySlug = async(slug: string): Promise<IProduct | null>=> {
    /* NO OLVIDARSE EL AWAIT!! */
    await db.connect()
    const product = await Product.findOne({slug}).lean()
    await db.disconnect()

    if(!product) return null

    /* Aca forzamos al objeto para que sea serealizado a un string
    Es la manera mas sencilla para evitar errores */
    /* Esto por lo general lo hacemos cuando dentro del objeto que vamos a retornar esta el id de Mongo,
    caso contrario no es necesario */
    return JSON.parse( JSON.stringify(product) )
}

interface ProductSlugs {
    slug: string
}

export const getAllProductsSlugs = async(): Promise<ProductSlugs[]>=> {
    await db.connect()
    /* Treamos todos los productos, pero solo requerimos los slugs de esos productos, para eso usamos el select */
    const slugs = await Product.find().select('slug -_id').lean()
    await db.disconnect()

    return slugs
}

export const getProductByTerm = async( term: string ): Promise<IProduct[]>=> {

    /* Pasamos el termino a minuscula ya que los tags se encuentran todos en minuscula */
    term = term.toString().toLowerCase()

    await db.connect()
    /* La condicion dentro del find significa que va a buscar entre el titulo y los tags las palabras que coincidan con el termino que le pasemos por parametro
    Sabemos que va a buscar entre el titulo y el tag porque lo definimos en el archivo models/Products.ts  */
    const products = await Product.find({$text: {$search: term}}).select('title images price inStock slug -_id').lean()
    await db.disconnect()

    return products
}

export const getAllProducts = async(): Promise<IProduct[]>=> {
    await db.connect()
    const products = await Product.find().lean()
    await db.disconnect()

    return JSON.parse( JSON.stringify(products) )
}