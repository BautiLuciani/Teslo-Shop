import { db } from '@/database'
import { IPaypal } from '@/interface'
import { Order } from '@/models'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return payOrder(req, res)

        default:
            res.status(400).json({ message: 'Bad Request' })
    }
}

/* Debemos obtener un token el cual vamos a mandar a paypal para que nos confirme si el pago fue realizado con exito o no 
Quizas es dificil de entender pero todo se encuentra en la documentacion de Paypal 
Anteriormente tuvimos que haber definido las variables de entorno 'PAYPAL_OAUTH_URL' y 'PAYPAL_ORDERS_URL' en el archivo '.env'
Ambas variables tambien se encuentran en la documentacion de Paypal */
/* COMPAÑERO */
/*const getPayPalBearerToken = async (): Promise<string | null> => {

    try {
        const { NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env

        const encodedToken = Buffer.from(NEXT_PUBLIC_PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET).toString('base64')

        const response = await fetch(process.env.PAYPAL_OAUTH_URL || '', {
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
                Accept: "application/json",
                Authorization: "Basic" + encodedToken,
            },
            body: "grant_type=client_credentials"
        })

        const { access_token } = await response.json();
        return access_token;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data)
        } else {
            console.log(error)
        }

        return null
    }
}*/

/* PROFE */
const getPaypalBearerToken = async():Promise<string|null> => {
    
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');


    try {
        
        const { data} = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;


    } catch (error) {
        if ( axios.isAxiosError(error) ) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }

        return null;
    }


}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    /* TODO: validar session del usuario */
    /* TODO: validar mongoId */

    /* Llamamos a la funcion para obtener el access_token */
    const paypalBearerToken = await getPaypalBearerToken()

    /* En caso de no poder obtener el token mostramos un mensaje de error */
    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'No se pudo obtener el token de paypal' })
    }

    /* Obtenemos el transactionId y el orderId que enviamos a traves del body
    Para obtenerlos del body debemos usar req.body
    transactionId = id de la transaccion que contiene la data de paypal
    orderId = id de la orden que se pago */
    const { transactionId = '', orderId = '' } = req.body

    /* Obtenemos la data del pago con paypal
    Anteriormente tuvimos que haber definido la interfaz de la data que nos devuelve paypal */
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>( `${process.env.PAYPAL_ORDERS_URL}/${ transactionId }`, {
        headers: {
            'Authorization': `Bearer ${ paypalBearerToken }`
        }
    })

    /* En caso de que el estado de la data no sea 'COMPLETED' lanzamos un error 401 ya que significa que hubo un problema con el pago*/
    if( data.status !== 'COMPLETED' ){
        return res.status(401).json({ message: 'Orden no reconocida' })
    }

    /* Verificamos de que exista una orden con el id que extramos del body */
    await db.connect()
    const dbOrder = await Order.findById(orderId)

    /* En caso de que no exista una orden con ese id retornamos un error 400 */
    if( !dbOrder ){
        await db.disconnect()
        return res.status(400).json({ message: 'Orden no existe en nuestra base de datos' })
    }

    /* Verificamos que el total de la orden coincida con el total de paypal
    En caso de que no coincidan retornamos un error 400 */
    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await db.disconnect()
        return res.status(400).json({ message: 'Los montos de Paypal y nuestra orden no son iguales' })
    }

    /* Si llegamos a este punto es porque todo salio bien
    En ese caso seteamos la orden como pagada y le definimos el transactionId
    Anteriormente tuvimos que haber agregado el transactionId a la iterfaz de IOrder */
    dbOrder.transactionId = transactionId
    dbOrder.isPaid = true
    await dbOrder.save()

    await db.disconnect()

    return res.status(200).json({ message: 'Orden Pagada' })
}
