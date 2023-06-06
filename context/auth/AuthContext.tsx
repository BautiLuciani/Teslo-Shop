import { IUser } from '@/interface';
import { createContext } from 'react'

interface ContextProps {
     isLoggedIn: boolean;
     user?: IUser

     // Metodos
     loginUser: (email: string, password: string) => Promise<boolean>
     registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string | undefined; }>
     onLogout: () => void
}

export const AuthContext = createContext({} as ContextProps)