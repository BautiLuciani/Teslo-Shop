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
    const usuario = JSON.stringify(session)
    const usuarioFinal = JSON.parse(usuario)
    
    /* Guardamos en una variable la pagina que nos encontramos */
    const requestedPage = req.nextUrl.pathname

    /* En caso de que el usuario no este loggeado lo vamos redireccionar a la pagina del login */
    if (!usuarioFinal) {
        /* Clonamos la url y le agregamos el path en donde se tiene que loggear el usuario, y ademas le pasamos el query de la pagina en la que nos encontramos */
        const url = req.nextUrl.clone()
        url.pathname = '/auth/login'
        url.search = `p=${requestedPage}`

        /* Si el usuario no esta loggeado e intenta entrar a la fuerza a una url que incluya alguna ruta de api le vamos a lanzar un error */
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

    /* Definimos los roles validos que van a poder entrar al dashboard*/
    const validRoles = ['admin', 'super-user', 'SEO']

    /* Si un usuario 'cliente' loggeado intenta entrar a la fuerza a una url que incluya alguna ruta de api le vamos a lanzar un error */
    if (requestedPage.includes('/api/admin') && !validRoles.includes(usuarioFinal.user.role)) {

        return new Response(JSON.stringify({ message: 'No autorizado' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    /* Si un usuario 'cliente' loggeado intenta entrar a la fuerza a una url que incluya la ruta de admin le vamos a lanzar un error */
    if (requestedPage.includes('/admin') && !validRoles.includes(usuarioFinal.user.role)) {
        return NextResponse.redirect(new URL('/', req.url));
    };

    /* En caso de que el usuario este loggeado lo vamos a redirijir a la pagina en la que nos encontramos */
    return NextResponse.next()
}

export const config = {
    /* Las paginas que definamos aca dentro van a ser donde se ejecute el middleware */
    matcher: ['/checkout/:path*'/*,'/orders/:path*','/api/orders/:path*'*/,'/admin/:path*','/api/admin/:path*']
}
