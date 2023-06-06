/* Es muy importante que el archivo se llame como se llama ahora
Los 3 puntitos significa que cualquier url que venga dentro de auth va a caer en este archivo */
/* Documentacion: https://next-auth.js.org/getting-started/example */

/* Para configurar GitHub como proveedor hay que seguir los siguientes pasos:
1. Ingresar a este link: https://github.com/settings/apps
2. Ir a Oauth Apps
3. New OAuth App → 
                a. Application name: el nombre de la aplicacion
                b. Homepage URL: podemos poner temporalmente el localhost, despues lo podemos cambiar
                c. Application description: descripcion de la aplicacion
                d. Authorization callback URL: podemos poner temporalmente lo mismo que el punto 'b'
4. Creamos el GITHUB_ID y GITHUB_SECRET en el archivo '.env' */

import { dbUsers } from "@/database"
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

/* Esto lo saque de los comentarios para solucionar un error */
declare module 'next-auth' {
    interface Session {
        accessToken?: string
    }
}

export const authOptions: NextAuthOptions = {
  /* Dentro de este arreglo de proveedores van a ir todas las redes sociales con las que el usuario va a poder loggearse */
  providers: [
    /* Para crear un login con nuestro sistema de automatizacion personalizado debemos usar el proveedor 'Credentials' */
    Credentials({
        /* El mismo necesita tres atributos */
        /* name: nombre de la credencial */
        name: 'Custom Login',
        /* credentials: definimos los campos */
        credentials: {
            email: {label: 'Correo', type: 'email', placeholder: 'ejemplo@gmail.com'},
            password: {label: 'Contraseña', type: 'password', placeholder: 'Contraseña'}
        },
        /* Metodo de autorizacion 
        Esta funcion debe retornar un null en caso de que la funcion falle o un objeto si todo sale bien
        El objeto debe contener la informacion que queremos que sea recibida para crear los token de autenticacion y lo demas */
        async authorize(credentials){
            /* Anteriormente creamos la funcion en database para comprobar de si existe el usuario en la DB */
            return await dbUsers.checkUserEmailAndPassword(credentials!.email, credentials!.password)
        }
    }),

    GithubProvider({
        /* Hay que ponerle el signo de exclamacion al final para evitar errores */
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],

  /* Custom Pages */
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  /* Duracion de la session */
  session: {
    maxAge: 2592000, // 30dias
    strategy: 'jwt',
    updateAge: 86400 // 1dia
  },

  /* Callbacks */
  callbacks: {
    /* Necesitamos definir dos callbacks, el jwt y session */

    /* JWT → para cuando se genere un nuevo token 
    JWT debe retornar un token */
    async jwt({ token, account, user}){

        if(account){
            token.accessToken = account.access_token

            switch(account.type){
                case 'oauth': 
                    // TODO: crear usuario o verificar si existe en mi DB
                    /* Anteriormente creamos la funcion en database para comprobar de si existe el usuario OAuth en la DB */
                    token.user = await dbUsers.checkOAuthUser( user?.email || '', user?.name || '')
                break;

                case 'credentials': 
                    token.user = user
                break;
            }
        }

        return token
    },
    /* Session → para cuando se cree una nueva session
    Session debe retornar una session */
    async session({ session, token, user}){

        session.accessToken = token.accessToken as any
        session.user = token.user as any

        return session
    }
  }
}

export default NextAuth(authOptions)