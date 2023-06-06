/* Podemos usar el snippet 'react-provider' creado por nosotros */
import { FC, PropsWithChildren, useReducer } from 'react'
import { UiContext, uiReducer } from './'

export interface UiState {
    isMenuOpen: boolean
}

const Ui_INITIAL_STATE: UiState = {
    isMenuOpen: false
}

interface Props extends PropsWithChildren<{}> {

}

/* No olvidemos de envolver el _app.tsx con este Provider */
export const UiProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, Ui_INITIAL_STATE)
    
    // Creamos la funcion para cambiar el valor de isMenuOpen
    const toggleSideMenu = ()=> {
        dispatch({type: 'Ui - ToggleMenu'})
    }

    return (
        <UiContext.Provider value={{
            ...state,

            // Metodos
            /* No olvidemos que hay que agregar los metodos en el UiContext */
            toggleSideMenu
        }}>
            {children}
        </UiContext.Provider>
    )
}