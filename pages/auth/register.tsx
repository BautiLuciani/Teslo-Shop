import { AuthLayout } from '@/components/layouts'
import { AuthContext } from '@/context';
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
    name: string,
    email: string,
    password: string
}

const RegisterPage = () => {

    /* Usamos el hook useForm de react-hook-form para tener un mejor manejo de nuestro formulario */
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    /* Creamos un estado para mostrar el error en caso de que los datos ingresados sean incorrectos */
    const [showError, setShowError] = useState(false)
    /* Creamos un estado para mostrar el mensaje de error en caso de que los datos ingresados sean incorrectos */
    const [errorMessage, setErrorMessage] = useState('')
    /* Utilizamos el AuthContext para extraer la funcion del registerUser */
    const { registerUser } = useContext(AuthContext)
    /* Utilizamos el router para redirijir al usuario luego de que se registre correctamente */
    const router = useRouter()

    /* Creamos la funcion la cual se va a ejecutar una vez que los campos esten validados y el usuario quiera loggearse */
    const onRegister = async ({ name, email, password }: FormData) => {

        /* Cada vez que el usuario quiera logearse el error vuelve a false */
        setShowError(false)

        const { hasError, message } = await registerUser(name, email, password)

        if (hasError) {
            /* Seteamos el mensaje de error
            Le ponemos el signo de exclamacion para avisar de que su valor no va a ser null */
            setErrorMessage(message!)
            /* Se muestra el error y luego de 3 segundos desaparece */
            setShowError(true)
            setTimeout(() => setShowError(false), 3000)
            /* No hay que olvidar el return para que se vaya de la funcion */
            return
        }

        /* Al igual que en el login, usamos el metodo signIn() de NextAuth para registrar al usuario */
        await signIn('credentials', { email, password })

        /* Esto ya no lo necesitamos porque estamos usando NextAuth
        // TODO: navegar a la pantalla que el usuario estaba 
        // Extraemos el query que habiamos puesto desde el Sidebar para redirijir al usuario a la pagina que estaba anteriormente
        // El 'p' es el nombre del query que nosotros le habiamos puesto. Hay que pasarlo a string porque puede que lo tome como un arreglo
        // En caso de que no haya ninguna query lo va a redirigir al home 
        const destination = router.query.p?.toString() || '/'
        // Utilizamos el 'replace' en vez del 'push' para que el usuario no pueda volver a la pantalla anterior
        router.replace(destination) */
    }

    return (
        <AuthLayout title='Crear Cuenta'>
            {/* Envolvemos todo el box dentro de la etiqueta form 
            En el form utilizamos la accion onSumbit() la cual le debemos pasar la funcion handleSubmit(), la cual ya viene de react-hook-form 
            handleSubmit() se va a ocupar de verificar que todos los campos esten correctos para luego ejecutar la funcion que le pasemos por parametro */}
            <form onSubmit={handleSubmit(onRegister)}>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Crear Cuenta</Typography>
                            { /* Mostramos un mensaje de error en caso de que los datos ingresados sean incorrectos */}
                            <Chip
                                label='No se ha podido realizar el registro. Intentelo de nuevo'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none', mt: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Nombre Completo'
                                variant='filled'
                                fullWidth
                                /* Propagamos algunas propiedades que el register nos va a facilitar el control del formulario
                                Asociamos el register con una de las propiedades del FormData, en este caso el nombre 
                                Luego le definimos las propiedades, por ejemplo si es requerido o no */
                                {
                                ...register('name', {
                                    /* Podemos definir el mensaje que queremos que nos muestre en caso de que el usuario no haya ingresado nada */
                                    required: 'El nombre no puede estar vacio',
                                    /* Le definimos la longitud minima
                                    Al ser un objeto le pasamos primero la cantidad de caracteres y luego el mensaje de error */
                                    minLength: { value: 2, message: 'El nombre debe tener al menos dos caracteres' }
                                })
                                }
                                /* Con la propiedad 'errors' de react-hook-form manejamos los errores
                                Poniendole !! adelante pasamos el valor a un booleano */
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                label='Correo'
                                variant='filled'
                                fullWidth
                                /* Propagamos algunas propiedades que el register nos va a facilitar el control del formulario
                                Asociamos el register con una de las propiedades del FormData, en este caso el email 
                                Luego le definimos las propiedades, por ejemplo si es requerido o no */
                                {
                                ...register('email', {
                                    required: 'El correo no puede estar vacio',
                                    /* Verificamos si el email es valido, antes creamos la validacion en utils/validations.ts */
                                    validate: validations.isEmail
                                })
                                }
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='password'
                                label='Contraseña'
                                variant='filled'
                                fullWidth
                                /* Propagamos algunas propiedades que el register nos va a facilitar el control del formulario 
                                Asociamos el register con una de las propiedades del FormData, en este caso la contraseña
                                Luego le definimos las propiedades, por ejemplo si es requerido o no */
                                {
                                ...register('password', {
                                    required: 'La contraseña no puede estar vacia',
                                    minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                                })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {/* Este boton va a ser de tipo submit */}
                            <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Typography variant='body1' sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
                            {/* Agregamos el query al path para no perder la informacion en caso de que el usuario se cambie a la pagina de login */}
                            <NextLink 
                                href={router.query.p ? `/auth/login?p=${router.query.p}` : 'auth/login'} 
                                passHref 
                                legacyBehavior
                            >
                                <Link underline='always'>
                                    Inicia Sesion
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

/* Creamos el SSR para que si el usuario ya esta registrado no pueda entrar mas a esta pagina */
export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    
    /* Verificamos si hay una session, es decir si esta registrado */
    const session = await getSession({req})

    /* Extraemos la query para redireccionar al usuario a la pagina que estaba anteriormente */
    const { p = '' } = query

    /* En caso de que haya una session vamos a redirijir al usuario */
    if(session){
        return {
            redirect: {
                /* Pasamos p a string porque puede ser que nos devolviera un arreglo */
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default RegisterPage