import { AuthLayout } from '@/components/layouts'
import { AuthContext } from '@/context';
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import { getProviders, signIn } from 'next-auth/react';
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

type FormData = {
    email: string,
    password: string
}

const LoginPage = () => {

    /* Usamos el hook useForm de react-hook-form para tener un mejor manejo de nuestro formulario */
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    /* Creamos un estado para mostrar el error en caso de que los datos ingresados sean incorrectos */
    const [showError, setShowError] = useState(false)
    /* Utilizamos el AuthContext para extraer la funcion del loginUser */
    const { loginUser } = useContext(AuthContext)
    /* Utilizamos el router para redirijir al usuario luego de que se loggue correctamente */
    const router = useRouter()

    /* Creamos este estado para almacenar los providers y mostrarlos como opcion de logeo 
    Al useState lo vamos a definir de tipo any para evitar mucho trabajo ya que es dificil definir los tipos en los providers */
    const [providers, setProviders] = useState<any>({})

    /* Usamos el useEffect para obtener los providers y guardarlos en el estado
    Para obtener los providers vamos a usar el metodo getProviders() de NextAuth */
    useEffect(() => {
      getProviders().then( prov => {
        setProviders( prov )
      })
    }, [])

    /* Creamos la funcion la cual se va a ejecutar una vez que los campos esten validados y el usuario quiera loggearse */
    const onLogin = async({ email, password }: FormData)=> {

        /* Cada vez que el usuario quiera logearse el error vuelve a false */
        setShowError(false)

        /* Utilizamos el metodo signIn() de NextAuth para logearnos
        El metodo requiere el nombre del proveedor y sus campos */
        await signIn('credentials', { email, password })

        /* Todo este codigo ya no lo necesitamos porque vamos a trabajar con NextAuth */
        /* const isValidLogin = await loginUser(email, password)

        // En caso de que el login no sea valido mostramos el error por 3 segundos 
        if(!isValidLogin){
            setShowError(true)
            setTimeout(()=> setShowError(false), 3000)
            // No hay que olvidar el return para que se vaya de la funcion 
            return
        }

        // TODO: navegar a la pantalla que el usuario estaba 
        // Extraemos el query que habiamos puesto desde el Sidebar para redirijir al usuario a la pagina que estaba anteriormente
        // El 'p' es el nombre del query que nosotros le habiamos puesto. Hay que pasarlo a string porque puede que lo tome como un arreglo
        // En caso de que no haya ninguna query lo va a redirigir al home 
        const destination = router.query.p?.toString() || '/'
        // Utilizamos el 'replace' en vez del 'push' para que el usuario no pueda volver a la pantalla anterior 
        router.replace(destination) */
    }

    return (
        <AuthLayout title='Ingresar'>
            {/* Envolvemos todo el box dentro de la etiqueta form 
            En el form utilizamos la accion onSumbit() la cual le debemos pasar la funcion handleSubmit(), la cual ya viene de react-hook-form 
            handleSubmit() se va a ocupar de verificar que todos los campos esten correctos para luego ejecutar la funcion que le pasemos por parametro */}
            <form onSubmit={ handleSubmit(onLogin) }>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Iniciar Sesion</Typography>
                            { /* Mostramos un mensaje de error en caso de que los datos ingresados sean incorrectos */}
                            <Chip
                                label='Usuario incorrecto. Intentelo de nuevo'
                                color='error'
                                icon={<ErrorOutline/>}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none', mt: 1}}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Correo'
                                type='email'
                                variant='filled'
                                fullWidth
                                /* Propagamos algunas propiedades que el register nos va a facilitar el control del formulario
                                Asociamos el register con una de las propiedades del FormData, en este caso el email 
                                Luego le definimos las propiedades, por ejemplo si es requerido o no */
                                { 
                                    ...register('email', {
                                        /* Podemos definir el mensaje que queremos que nos muestre en caso de que el usuario no haya ingresado nada */
                                        required: 'El correo no puede estar vacio',
                                        /* Verificamos si el email es valido, antes creamos la validacion en utils/validations.ts */
                                        validate: validations.isEmail,
                                        
                                    }) 
                                }
                                /* Con la propiedad 'errors' de react-hook-form manejamos los errores
                                Poniendole !! adelante pasamos el valor a un booleano */
                                error={ !!errors.email }
                                helperText= {errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Contraseña'
                                type='password'
                                variant='filled'
                                fullWidth
                                /* Propagamos algunas propiedades que el register nos va a facilitar el control del formulario 
                                Asociamos el register con una de las propiedades del FormData, en este caso la contraseña
                                Luego le definimos las propiedades, por ejemplo si es requerido o no */
                                { 
                                    ...register('password', {
                                        required: 'La contraseña no puede estar vacia',
                                        /* Le definimos la longitud minima
                                        Al ser un objeto le pasamos primero la cantidad de caracteres y luego el mensaje de error */
                                        minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres'}
                                    }) 
                                }
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {/* Este boton va a ser de tipo submit */}
                            <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Typography variant='body1' sx={{ mr: 1 }}>¿No tienes cuenta?</Typography>
                            {/* Agregamos el query al path para no perder la informacion en caso de que el usuario se cambie a la pagina de registro */}
                            <NextLink 
                                href={router.query.p ? `/auth/register?p=${router.query.p}` : 'auth/register'} 
                                passHref 
                                legacyBehavior
                            >
                                <Link underline='always'>
                                    Registrate
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{width: '100%', mb: 2}}/>
                            {
                                /* Los providers estan almacenados en un objeto, no en un arreglo, por eso no podemos usar map directo */
                                Object.values( providers ).map((provider: any) => {
                                    
                                    /* Hay que mostrar todos los providers menos las credenciales que son nuestro Custom Provider */
                                    if(provider.id === 'credentials') return <div key='credentials'></div>

                                    return (
                                        <Button
                                            key={provider.id}
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{mb: 1}}
                                        >
                                            { provider.name }
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

/* Creamos el SSR para que si el usuario ya esta loggeado no pueda entrar mas a esta pagina */
export const getServerSideProps: GetServerSideProps = async ({req, query, res}) => {
    
    /* Verificamos si hay una session, es decir si esta loggeado */
    const session = await getServerSession(req, res, authOptions)

    /* session nos devuelve un [object Object] por eso lo trabajamos de la siguiente manera y extraemos user */
    const {user} = JSON.parse(JSON.stringify(session))

    /* Extraemos la query para redireccionar al usuario a la pagina que estaba anteriormente */
    const { p = '/' } = query

    /* En caso de que haya una session vamos a redirijir al usuario */
    if(user){
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

export default LoginPage