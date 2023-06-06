/* Los middleware son archivos que se van a ejecutar antes que los archivos que definamos, es decir que si
queremos acceder a 'address.tsx' o 'summary.tsx' antes va a pasar por el middleware.
Al igual que SSR, los middlewares son servidos bajo request time
En el middleware vamos a ejecutar las funciones para validar de que el usuario este logeado. En caso de no
estarlo, se lo va a redirijir a la pagina de logeo.
Documentacion: https://nextjs.org/docs/pages/building-your-application/routing/middleware */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/* Su estructura es la siguiente. Lo podemos encontrar en la documentacion */
export async function middleware(req: NextRequest) {

    /* Verificamos si hay un usuario loggeado.
    Para eso vamos a usar el metodo 'getToken()' de NextAuth el cual requiere dos parametros
    El primero va a ser la request, y el segundo la llave secreta que la tenemos en el archvio '.env' */
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    /* Guardamos en una variable la pagina que nos encontramos */
    const requestedPage = req.nextUrl.pathname

    /* Compañero: definimos los roles validos */
    const validRoles = ['admin', 'super-user', 'SEO']

    /* En caso de que el usuario no este loggeado lo vamos redireccionar a la pagina del login */
    if (!session) {
        /* Clonamos la url y le agregamos el path en donde se tiene que loggear el usuario, y ademas le pasamos el query de la pagina en la que nos encontramos */
        const url = req.nextUrl.clone()
        url.pathname = '/auth/login'
        url.search = `p=${requestedPage}`

        /* Compañero */
        if (requestedPage.includes('/api')) {
            return new Response(JSON.stringify({ message: 'No autorizado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };

        /* Redireccionamos al usuario al url que es la pagina de login con el query de la pagina que estamos actualmente */
        return NextResponse.redirect(url)
    }

    /* Compañero */
    if (requestedPage.includes('/api/admin') && !validRoles.includes(session.user.role)) {

        return new Response(JSON.stringify({ message: 'No autorizado' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    /* Compañero */
    if (requestedPage.includes('/admin') && !validRoles.includes(session.user.role)) {
        return NextResponse.redirect(new URL('/', req.url));
    };

    /* En caso de que el usuario este loggeado lo vamos a redirijir a la pagina en la que nos encontramos */
    return NextResponse.next()
}

export const config = {
    /* Las paginas que definamos aca dentro van a ser donde se ejecute el middleware */
    matcher: ['/checkout/:path*','/orders/:path*','/api/orders/:path*','/admin/:path*','/api/admin/:path*']
}
