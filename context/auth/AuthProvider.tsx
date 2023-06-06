import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import { AuthContext, authReducer } from './'
import { IUser } from '@/interface'
import { tesloApi } from '@/api'
import Cookies from 'js-cookie'
import axios from 'axios';
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

export interface AuthState {
    isLoggedIn: boolean
    user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}

interface Props extends PropsWithChildren<{}> {

}

export const AuthProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

    /* Vamos a utilizar el router para la funcion del loggout */
    const router = useRouter()

    /* Utilizamos el useSession para obtener los estados de autenticacion. Dentro del useSession viene
    la data la cual es la informacion del usuario, y el status que es el estado de autenticacion,
    por ejemplo si ya esta autenticado o no */
    const { data, status } = useSession()

    /* Usamos el useEffect para ejecutar el dispatch pasandole el user que extraemos del useSession */
    useEffect(() => {
      if(status === 'authenticated'){
        dispatch({type: 'Auth - Login', payload: data?.user as IUser})
      }
    }, [ status, data])
    

    /* Este useEffect con su funcion ya no lo vamos a necesitar debido a que reemplazamos nuestro
    sistema de autenticacion personalizado por el NextAuth */
    /* useEffect(() => {
      checkToken()
    }, [])

    const checkToken = async()=> {
        
        if(!Cookies.get('token')) return

        try {
            const { data } = await tesloApi.get('user/validateToken')
            const { token, user } = data
            Cookies.set('token', token)
            dispatch({type: 'Auth - Login', payload: user})

        } catch (error) {
            Cookies.remove('token')
        }
    } */

    const loginUser = async ( email: string, password: string ): Promise<boolean> => {

        try {
            /* Le enviamos el email y password que ingreso el usuario al back
            tesloApi es un archivo que creamos anteriormente el cual solo contiene el principio de la url para no andar repitiendo */
            const { data } = await tesloApi.post('/user/login', { email, password })
            /* Extraemos el token y user de la data */
            const { token, user } = data
            /* Guardamos el token en las cookies */
            Cookies.set('token', token)
            /* Hacemos el dispatch */
            dispatch({ type: 'Auth - Login', payload: user })
            return true
        } catch (error) {
            return false
        }

    }

    /* Podemos definir el retorno es una linea como lo hicimos en este caso, o podriamos crear una interfaz con las opciones de retorno */
    const registerUser = async(name: string, email: string, password: string): Promise<{ hasError: boolean, message?: string}>=> {

        try {
            /* La logica es la misma que la del login */
            const { data } = await tesloApi.post('/user/register', {name, email, password})
            const { token, user } = data
            Cookies.set('token', token)
            dispatch({type: 'Auth - Login', payload: user})
            return {
                hasError: false
            }
            
        } catch (error) {
            /* Definimos el error en caso de que sea por culpa de axios */
            if(axios.isAxiosError(error)){
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            /* Definimos el error en caso de que sea culpa nuestra */
            return {
                hasError: true,
                message: 'No se puede crear el usuario. Intentelo nuevamente.'
            }
        }

    }

    const onLogout = ()=> {
        /* Limpiamos todas las cookies */
        Cookies.remove('cart')
        Cookies.remove('firstName')
        Cookies.remove('lastName')
        Cookies.remove('address')
        Cookies.remove('address2')
        Cookies.remove('zip')
        Cookies.remove('city')
        Cookies.remove('country')
        Cookies.remove('phone')

        /* Utilizamos el metodo signOut() de NextAuth para desloguarse */
        signOut()

        /* Esto ya no lo necesitamos porque estamos utilizando NextAuth. Ahora utilizamos el metodo singOut() */
        /* Al hacer el reload el token ya no va a estar en las cookies, lo cual hace que automaticamente se deslogue el usuario */
        /* Cookies.remove('token')
        router.reload()*/
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            // Metodos
            loginUser,
            registerUser,
            onLogout
        }}>
            {children}
        </AuthContext.Provider>
    )
}