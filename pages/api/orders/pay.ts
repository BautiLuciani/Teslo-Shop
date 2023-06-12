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
const getPayPalBearerToken = async (): Promise<string | null> => {

    try {
        const { PAYPAL_CLIENT, PAYPAL_SECRET } = process.env

        const encodedToken = Buffer.from(PAYPAL_CLIENT + ":" + PAYPAL_SECRET).toString('base64')

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
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    /* Llamamos a la funcion para obtener el access_token */
    const paypalBearerToken = await getPayPalBearerToken()

    /* En caso de no poder obtener el token mostramos un mensaje de error */
    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'No se pudo obtener el token de paypal' })
    }

    return res.status(200).json({ message: paypalBearerToken })
}
