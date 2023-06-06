import { IProduct } from '@/interface'
import useSWR, {SWRConfiguration} from 'swr'

/* Para empezar debemos crear esta funcion la cual lo unico que hace es realizar el fetch
Podemos modificar esta funcion para combinarla con otras librerias como axios
Esta funcion esta la que viene por defecto en la documentacion oficial */
/* Para tener esta misma funcion globalmente, debemos envolver el _app.tsx en el provider de SWR
Vamos a definir esta funcion globalmente, pero en caso de querer dejar la funcion aca se veria de la siguiente manera: */
/* const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json()) */

export const useProduct = (url: string, config: SWRConfiguration = {}) => {
    /* SWR es una libreria oficial de NextJS para el fetching de datos 
    Podemos extraer varias cosas como la data o el error
    Los dos parametros obligatorios son el endpoint y la funcion (fetcher)
    Ademas podemos agregarle como parametro las configuraciones, pero estas pueden ser opcionales
    por eso en caso de no mandarlas su valor va a ser igual a un objeto vacio */
    /* Si definimos la funcion globalmente en el _app.tsx no es necesario pasarle el parametro 'fetcher' */
    const { data, error } = useSWR<IProduct[]>(`/api${url}`, /*fetcher,*/ config)

    return {
        products: data || [],
        isLoading: !data && !error,
        isError: error
    }
}

