import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context';
import { countries, jwt } from '@/utils'
import { Box, Button, FormControl, Grid, MenuItem, NoSsr, Select, TextField, Typography } from '@mui/material'
import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
    firstName: string,
    lastName: string,
    address: string,
    address2?: string,
    zip: string,
    city: string,
    country: string,
    phone: string
}

/* Creamos la funcion para recuperar la informacion que habia puesto el usuario */
const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || ''
    }
}

const AddressPage = () => {

    /* Usamos el useRouter para redirijir al usuario a la proxima pagina */
    const router = useRouter()

    /* Utilizamos el CartContext para actualizar la direccion del usuario en las cookies */
    const { updateAddress } = useContext(CartContext)

    /* Usamos el hook useForm de react-hook-form para tener un mejor manejo de nuestro formulario */
    /* Definimos valores por defecto. Esto nos va a ayudar a almacenar la informacion para que si el 
    usuario sale y vuelve a entrar, sigan estando los valores que el habia puesto en los campos */
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    const onDirections = (data: FormData) => {
        updateAddress(data)
        router.push('/checkout/summary')
    }

    return (
        <ShopLayout title='Direccion' pageDescription='Direccion donde el usuario desearia recibir su pedido'>
            <form onSubmit={handleSubmit(onDirections)}>
                <Typography variant='h1' component='h1'>Direccion</Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant='filled'
                            fullWidth
                            {
                            ...register('firstName', {
                                required: 'El nombre no puede estar vacio'
                            })
                            }
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellido'
                            variant='filled'
                            fullWidth
                            {
                            ...register('lastName', {
                                required: 'El apellido no puede estar vacio'
                            })
                            }
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Direccion'
                            variant='filled'
                            fullWidth
                            {
                            ...register('address', {
                                required: 'La direccion no puede estar vacia'
                            })
                            }
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Direccion 2 (opcional)'
                            variant='filled'
                            fullWidth
                            {
                            ...register('address2')
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Codigo Postal'
                            variant='filled'
                            fullWidth
                            {
                            ...register('zip', {
                                required: 'El codigo postal no puede estar vacio'
                            })
                            }
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant='filled'
                            fullWidth
                            {
                            ...register('city', {
                                required: 'La ciudad no puede estar vacia'
                            })
                            }
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            {/* El NoSsr es para evitar un error que estabamos teniendo porque en el servidor
                            el valor del pais era ARG y en el front era otro pais que hubiesemos seleccionado,
                            entonces al no coincidir lanzaba un error
                            Otra solucion hubiese sido agregar el siguiente key al TextField:
                            key={Cookies.get('country') || countries[0].code} */}
                            <NoSsr>
                                <TextField
                                    select
                                    variant='filled'
                                    label='Pais'
                                    defaultValue={Cookies.get('country') || 'ARG'}
                                    {
                                    ...register('country', {
                                        required: 'El pais no puede estar vacio'
                                    })
                                    }
                                    error={!!errors.country}
                                    helperText={errors.country?.message}
                                >
                                    {
                                        countries.map(country => (
                                            <MenuItem
                                                key={country.code}
                                                value={country.code}
                                            >
                                                {country.name}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </NoSsr>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Telefono'
                            variant='filled'
                            fullWidth
                            {
                            ...register('phone', {
                                required: 'El telefono no puede estar vacio'
                            })
                            }
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='end'>
                    {/* Este boton va a ser de tipo submit */}
                    <Button type='submit' color='secondary' className='circular-btn' size='large'>
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}

/* Podriamos utilizar SSR como hicimos a continuacion para verificar si el usuario esta logeado o no antes
de entrar a esta pagina. Sin embargo, lo ideal seria hacer que el servidor trabaje lo menos posible, es
por esto que tomamos otra solucion que es la de los middlewares */

/* Creamos un SSR para que verifique si existe un token en las cookies, y si el token en valido
En caso de que no haya un token significa que el usuario no esta loggueado y lo va a redirijir a la pagina del login
En caso de que haya un token y sea valido va a mostrar esta pagina */
/* export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Extraemos el token de las cookies
    const { token = '' } = ctx.req.cookies
    let tokenValido = false

    // Comprobamos si hay un token en las cookies y si es valido
    try {
        await jwt.isValidToken( token )
        tokenValido = true
    } catch (error) {
        tokenValido = false
    }

    // En caso de que no haya un token o no sea valido lo redirijimos a la pagina del login
    // Pero le pasamos por query la direccion de esta pagina para poder redirijir al usuario aca una vez que se loguee
    if( !tokenValido ){
        return {
            redirect: {
                destination: '/auth/login?p=/checkout/address',
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
} */

export default AddressPage