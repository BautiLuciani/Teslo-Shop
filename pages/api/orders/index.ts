/* Podemos usar el snippet 'nextapi' para crear la estructura */
import { db, dbProducts } from '@/database';
import { IOrder } from '@/interface'
import { Order, Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

type Data = 
| { message: string }
| IOrder

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'POST':
            return createOrder( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad Request' })
    }

}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    /* Obtenemos la informacion que mandamos en el body cuando utilizamos la funcion createOrder() del CartProvider 
    Para obtenerla la extraemos del req.body */
    const { orderItems, total } = req.body as IOrder

    /* Verificamos de que haya un usuario loggeado, en caso de que no lo haya retornamos un status 401
    Podemos usar el getServerSession() de NextAuth para verificar la session del usuario, pero en middleware es recomendable usar getToken() */
    const session: any = await getServerSession( req, res, authOptions)

    /* session nos devuelve un [object Object] por eso lo trabajamos de la siguiente manera y extraemos user */
    const {user} = JSON.parse(JSON.stringify(session))

    if(!user){
        return res.status(401).json({message: 'Debe estar autenticado para hacer esto'})
    }

    /* Verificamos de que los precios del front coincidan con los precios del back, para evitar que alguien pueda manipular los precios */
    /* Para eso primero debemos obtener los ids de los productos para buscarlos en DB y obtener los productos que coincidan con esos ids */
    const productsId = orderItems.map( product => product._id)
    await db.connect()
    const dbProducts = await Product.find({ _id: { $in: productsId } })

    try {
        const subTotal = orderItems.reduce( (prevProduct, actualProduct ) => {
            /* Nos aseguramos de que el id del producto coincida con el de DB y extraemos el precio
            El reduce se va a ocupar de verificar cada producto y luego ir sumando los precios */
            const productPrice = dbProducts.find( prod => prod.id === actualProduct._id)?.price
            /* Si no tenemos un productPrice significa que algo fue manipulado, porque sino todo tuvo que haber salido bien */
            if(!productPrice){
                throw new Error('Verifique el carrito de nuevo, producto no existe')
            }

            return (productPrice * actualProduct.quantity) + prevProduct
        }, 0)

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
        const tax = subTotal * taxRate
        const backendTotal = subTotal + tax

        /* Verificamos de que el total del front coincida con el total del back
        En caso de no ser asi retornamos un error */
        if(total !== backendTotal){
            throw new Error('El total no cuadra con el monto')
        }

        /* Si llegamos hasta este punto es porque todo salio bien */
        /* Obtenemos el id del usuario para agregarlo a la orden */
        const userId = user.id
        /* Creamos una nueva orden y la guardamos en DB */
        const newOrder = new Order({...req.body, isPaid: false, user: userId})
        await newOrder.save()
        return res.status(200).json( newOrder )

    } catch (error: any) {
        await db.disconnect()
        console.log(error);
        res.status(401).json({message: error.message || 'Revise logs del servidor'})
    }

    return res.status(201).json( req.body )
}

