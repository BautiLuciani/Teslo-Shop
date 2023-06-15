import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { AdminLayout } from '../../../components/layouts'
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { IProduct } from '@/interface';
import { useForm } from 'react-hook-form';
import { tesloApi } from '@/api';
import { Product } from '@/models';
import { useRouter } from 'next/router';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

/* Definimos como va a lucir las propiedades del form */
interface FormData {
    /* El id es opcional ya que si queremos crear un nuevo producto, al principio ese no va a tener un id
    Entonces si recibimos un id es porque estamos modificando un producto ya existente
    Y si no lo recibimos es porque estamos creando un nuevo producto */
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: string
}

interface Props {
    product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
    
    /* Utilizamos el useForm para un manejo mas sencillo de nuestro formulario */
    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
        /* Sus valores por defectos van a ser los valores del producto */
        defaultValues: product
    })

    /* Vamos a usar el router para remplazar el 'new' de la url por el slug del nuevo producto que se creo */
    const router = useRouter()

    /* Usamos el useRef para crear una referencia al input el cual carga las imagenes y que al hacer click
    en el button 'Cargar Imagen' de MUI en realidad se ejecute ese input */
    const fileInputRef = useRef<HTMLInputElement>(null)

    /* Usamos este useState para almacenar el valor del nuevo tag para luego agregarlo a arreglo de tags del producto */
    const [newTagValue, setNewTagValue] = useState('')
    /* Usamos este useState para saber cuando se estan guardando los cambios del producto y evitar que vuelvan a tocar el boton de guardar mientras este cargando */
    const [isSaving, setIsSaving] = useState(false)

    /* Utilizamos el useEffect para crear un observable el cual este pendiente a los cambios del form
    Lo necesitamos para estar pendiente cuandp hay un cambio en el title para poder crear un slug en base a ese nuevo title */
    useEffect(() => {
        /* Utilizamos 'watch' de useForm para estar observando los cambios que hay en el formulario
        El watch es una funcion la cual vamos a necesitar los parametros value y name
        Value contiene todos los valores del form, mientras que name es el nombre del input el cual se esta detectando cambios */
        const subscription = watch((value, { name }) => {
            /* Si el name del campo que se esta detectando un cambio en 'title' entonces vamos a crear y etear el nuevo slug */
            if (name === 'title') {
                const newSlug = value.title?.trim()
                    .replaceAll(" ", "_")
                    .replaceAll("'", "")
                    .toLocaleLowerCase() || ""

                setValue('slug', newSlug)
            }
        })

        return () => {
            /* Se le llama "subscription" a todo lo que retorna el watch 
            Si no cortamos con la subscription el watch va a seguir pendiente a los campos por mas que no nos encontremos en esta pagina
            Es por eso que debemos utilizar el metodo unsubscribe() para cortar con el watch cuando no estemos en esta pagina */
            subscription.unsubscribe()
        }
    }, [watch, setValue])

    /* Usamos esta funcion para que se ejecute una vez que se hayan validado todos los campos del form */
    const onSubmit = async(form: FormData) => {
        
        /* Verificamos de que haya al menos dos imagenes */
        if( form.images.length < 2){
            return console.log('Deben a ver al menos dos imagenes');
        }

        setIsSaving(true)

        /* Intentamos guardar las modificaciones */
        try {
            const {data} = await tesloApi({
                url: '/admin/products',
                /* Si el _id no viene es porque queremos crear un producto (POST), y si viene es que queremos actualizarlo (PUT) */
                method: form._id ? 'PUT' : 'POST',
                data: form
            }) 

            /* Si el form._id no existe significa que vamos a crear producto, sino actualizar */
            if(!form._id){
                /* Reemplazamos el 'new' de la url por el slug del nuevo producto que se creo
                Esto es porque si no cambiamos la url el usuario va a seguir estando en la pagina de creacion de productos, y va a poder crear un nuevo producto
                Esto no esta mal, simplemente son gustos */
                router.replace(`/admin/products/${form.slug}`)
            } else {
                setIsSaving(false)
            }
        } catch (error) {
            console.log(error);
            setIsSaving(false)
        }
    }

    /* Usamos esta funcion para cambiar el checkbox de las tallas */
    const onChangeSize = (size: string) => {
        /* Obtenemos un arreglo con todas las tallas */
        const currentSizes = getValues('sizes')
        /* Si el size que pasamos por parametro esta incluido en el arreglo de sizes es porque esta seleccionado y lo queremos deseleccionar
        Recordemos que si queremos ver el cambio instantaneamente debemos pasarle el parametro shouldValidate: true */
        if (currentSizes.includes(size)) {
            return setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true })
        }
        /* En caso de que el size que pasamos por parametro no este incluido en el arreglo es porque no esta seleccionado y lo queremos seleccionar 
        El problema es que agregamos el nuevo size al final del arreglo, es decir que no cumple con un orden. Esto lo podemos arreglar despues desde el back */
        setValue('sizes', [...currentSizes, size], { shouldValidate: true })
    }

    /* Usamos esta funcion para agregar un nuevo tag al arreglo de tags del producto */
    const onNewTag = ()=> {
        /* Obtenemos el new tag que lo tenemos almacenado en el estado
        Ademas le quitamos los espacios que podria tener y lo pasamos a minuscula */
        const newTag = newTagValue.trim().toLocaleLowerCase()
        /* Volvemos a setear el newTagValue en su estado original */
        setNewTagValue('')
        /* Obtenemos todos los tags que se encuentran en el arreglo */
        const currentTags = getValues('tags')
        /* En caso de que el arreglom con los tags ya incluya el nuevo tag no lo vamos a volver a agregar */
        if(currentTags.includes(newTag)){
            return
        }
        /* En caso de que el nuevo tag no este incluido en el arreglo, lo agregamos */
        setValue('tags', [...currentTags, newTag])
    }

    /* Usamos esta funcion para eliminar tags */
    const onDeleteTag = (tag: string) => {
        /* Obtenemos todos los tags que se encuentran en el arreglo */
        const currentTags = getValues('tags')
        /* Cuando el tag coincida con uno de los tags del arreglo lo vamos a sacar */
        const deleteTag = currentTags.filter( t => t !== tag)
        setValue('tags', deleteTag, { shouldValidate: true })
    }

    /* Usamos esta funcion para subir las imagenes cada vez que haya un cambio en ellas */
    const onFieldSelected = async({target}: ChangeEvent<HTMLInputElement>)=> {
        /* En caso de que el usuario no haya seleccionado ningun archivo no hacemos nada */
        if(!target.files || target.files.length === 0){
            return
        }

        /* Caso contrario intentamos subir los archivos
        Anteriormente tuvimos que haber creado un REST que nos permita hacer eso */
        try {
            for(const file of target.files){
                const formData = new FormData()
                /* Agregamos el valor del file al formData con el metodo append() */
                formData.append('file', file)
                /* Enviamos el formData en el body de la peticion para cargar las imagenes
                Dento de data.message va a estar almacenado la url de la imagen que subimos */
                const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData)
                /* Guardamos la url de la imagen en el arreglo de imagenes */
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true })
            } 
        } catch (error) {
            console.log(error);   
        }
    }

    /* Usamos esta funcion para eliminar las imagenes */
    const onDeleteImage = (img: string)=> {
        /* Filtramos todas las imagenes que no coincidan con la img que pasamos por parametro */
        const deleteImage = getValues('images').filter( image => image !== img)
        /* Seteamos los valores de 'images' con las imagenes filtradas */
        setValue('images', deleteImage, { shouldValidate: true })
        /* Esto sin embargo borra las imagenes del lado del front pero no elimina las fotos de cloudinary
        Para eliminar las fotos de cloudinary lo vamos a hacer en (pages/api/admin/products.ts) */
    }

    return (
        <AdminLayout
            title={product._id ? 'Producto' : 'Crear producto'}
            subtitle={product._id && `Editando: ${product.title}`}
            icon={<DriveFileRenameOutline />}
        >
            {/* Envolvemos todo el box dentro de la etiqueta form 
            En el form utilizamos la accion onSumbit() la cual le debemos pasar la funcion handleSubmit(), la cual ya viene de react-hook-form 
            handleSubmit() se va a ocupar de verificar que todos los campos esten correctos para luego ejecutar la funcion que le pasemos por parametro */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled= {isSaving}
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            /* Propagamos algunas propiedades que el register nos va a facilitar el control del formulario
                            Asociamos el register con una de las propiedades del FormData, en este caso el title 
                            Luego le definimos las propiedades, por ejemplo si es requerido o no */
                            {...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'El titulo debe ser de al menos 2 caracteres' }
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth
                            multiline
                            sx={{ mb: 1 }}
                            {...register('description', {
                                required: 'Este campo es requerido'
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('inStock', {
                                required: 'Este campo es requerido',
                                minLength: { value: 0, message: 'Minimo de valor 0' }
                            })}
                            error={!!errors.inStock}
                            helperText={errors.inStock?.message}
                        />

                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('price', {
                                required: 'Este campo es requerido',
                                minLength: { value: 0, message: 'Minimo de valor 0' }
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                /* Para obtener el valor actual del type podemos usar el metodo getValues() que nos brinda el useForm
                                El getValues() solo necesita un parametro que es el nombre de la propiedad que queremos obtener el valor */
                                value={getValues('type')}
                                /* Para setear un nuevo valor podemos usar el metodo setValue() que nos brinda el useForm 
                                El setValue() requiere dos parametros, el nombre de la propiedad que queremos setearle un valor, y el valor que le queremos setear
                                Pero no vamos a ver el seteo instantaneamente salvo que le pasemos un tercer parametro, shouldValidate: true
                                Extraemos el target del event para obtener el nuevo valor que queremos setear */
                                onChange={({ target }) => setValue('type', target.value, { shouldValidate: true })}
                            >
                                {
                                    validTypes.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('gender')}
                                onChange={({ target }) => setValue('gender', target.value, { shouldValidate: true })}
                            >
                                {
                                    validGender.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel
                                        key={size}
                                        control={<Checkbox checked={getValues('sizes').includes(size)} />}
                                        onChange={() => onChangeSize(size)}
                                        label={size}
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('slug', {
                                required: 'Este campo es requerido',
                                /* Verificamos de que el slug no contenga espacios */
                                validate: (val) => val.trim().includes(' ') ? 'No puede tener espacios en blanco' : undefined
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={ newTagValue }
                            onChange={ ({target})=> setNewTagValue(target.value)}
                            /* Usamos onKeyUp para ejecutar una funcion cuando apretamos el space 
                            Para saber la key que apretamos debemos extraer code */
                            onKeyUp={ ({code}) => code === 'Space' ? onNewTag() : undefined }
                        />

                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                            component="ul">
                            {
                                getValues('tags').map((tag) => {
                                    return (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => onDeleteTag(tag)}
                                            color="primary"
                                            size='small'
                                            sx={{ ml: 1, mt: 1 }}
                                        />
                                    );
                                })
                            }
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3 }}
                                /* Usamos el onClick para llamar a la referencia
                                Para eso debemos utilizar 'current' que es el valor que se almacena en la referencia (en este caso el input)
                                Y debemos agregarle el 'click()' que significa que queremos que actue como si estuviera clickeando en el input */
                                onClick={()=> fileInputRef.current?.click()}
                            >
                                Cargar imagen
                            </Button>

                            { /* Creamos un input para cargar imagenes, pero este input no se va a ver porque es feo
                            Entonces creamos una referencia para que al hacer click al button de arriba se ejecute este input */}
                            <input
                                /* Creamos la referencia con ref */
                                ref={ fileInputRef }
                                type="file"
                                multiple
                                accept='image/png, image/gif, image/jpeg'
                                style={{ display: 'none'}}
                                onChange={ onFieldSelected }
                            />

                            <Chip
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none', mb: 2}}
                            />

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map(img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia
                                                    component='img'
                                                    className='fadeIn'
                                                    image={img}
                                                    alt={img}
                                                />
                                                <CardActions>
                                                    <Button fullWidth color="error" onClick={()=>onDeleteImage(img) }>
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { slug = '' } = query;

    /* El product va a ser un producto de tipo IProduct */
    let product: IProduct | null

    /* En caso de que el slug sea 'new' significa que queremos crear un nuevo producto
    Caso contrario significa que queremos modificar un producto, entoces vamos a obtener el producto por su slug y mostrarlo en pantalla */
    if( slug === 'new' ){
        /* Creamos un producto temporal el cual va a estar con sus valores por defecto que definimos en los modelos */
        const tempProduct = JSON.parse( JSON.stringify(new Product()))
        /* Al crear un nuevo producto automaticamente se crea un id, hay que eliminar el _id porque sino va a evitar que se cree el producto */
        delete tempProduct._id
        /* Como todavia no tenemos manera de subir imagenes definimos imagenes random */
        tempProduct.images = []
        /* Finalmente el product va a ser igual al producto temporal que creamos */
        product = tempProduct
    } else {
        product = await dbProducts.getProductBySlug(slug.toString());
    }

    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }

    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage