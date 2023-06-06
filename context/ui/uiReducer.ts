/* Podemos usar el snippet 'react-context-reducer' creado por nosotros */
import { UiState } from '.';

type UiActionType =
    | { type: 'Ui - ToggleMenu' }

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
    switch (action.type) {
        case 'Ui - ToggleMenu':
            return {
                ...state,
                /* Cuando ejecutemos esta accion el valor de isMenuOpen va a ser el opuesto al valor que se encuentra */
                isMenuOpen: !state.isMenuOpen
            }

        default:
            return state;
    }
}