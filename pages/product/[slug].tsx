import { ShopLayout } from '@/components/layouts'
import { ProductSizeSelector, ProductSlideshow } from '@/components/products'
import { ItemCounter } from '@/components/ui'
import { CartContext } from '@/context'
import { dbProducts } from '@/database'
import { ICartProduct, IProduct, ISize } from '@/interface'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { NextPage, GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

interface Props {
    product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

    // Hay varias maneras para obtener la informacion de un producto. Una de ellas es la siguiente:
    /* Usamos el router para extraer el slug el cual se almacena en router.query.slug
    Usamos el slug para hacer un llamado a la api y que nos retorne la informacion de ese slug */
    /* const router = useRouter()
    // products: product → aca lo unico qye estamos haciendo es reenombrar products por product
    const {products: product, isLoading} = useProducts(`/products/${router.query.slug}`) */
    /* Esto sin embargo nos va a traer un par de problemas ya que useProducts esta esperando un arreglo,
    entonces vamos a tener que hacer un par de configuraciones */
    /* Esto seria una buena solucion si estamos trabajando en react, pero en next hay mejores soluciones */

    /* En este caso vamos a usar el router para redirijir al usuario a la pagina del carrito */
    const router = useRouter()

    /* Utilizamos el CartContext para extraer la funcion la cual nos permite agregar un producto al carrito */
    const { addProductCart } = useContext(CartContext)

    /* Creamos un producto temporal con los datos basicos
    Esto lo vamos a usar para que en caso de que size = undefined el usuario no pueda agregar al carrito
    Vamos a cambiar el valor de undefined con la funcion ... */
    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1
    })

    /* Con esta funcion cambiamos el valor del size del tempCartProduct con el size que el usuario eligio */
    const selectedSize = (size: ISize)=> {
        setTempCartProduct( prod => ({
            ...prod,
            size: size
        }))
    }

    /* Con esta funcion cambiamos la cantidad del producto del tempCartProduct con la cantidad que el usuario eligio */
    const updateQuantity = (quantity: number)=> {
        setTempCartProduct( prod => ({
            ...prod,
            quantity
        }))
    }

    const onAddProduct = ()=> {
        if(!tempCartProduct.size) return

        // Todo: llamar la accion del context para agregar al carrito
        /* Le pasamos como parametro el tempCartProduct, ya que a estas instancias esta almacenado 
        el tamaño y la cantidad de productos que quiere el usuario */
        addProductCart(tempCartProduct)
        router.push('/cart')
    }

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    {/* Slideshow */}
                    <ProductSlideshow
                        images={product.images}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Box display='flex' flexDirection='column'>

                        {/* Titulos */}
                        <Typography variant='h1' component='h1'>{product.title}</Typography>
                        <Typography variant='subtitle1' component='h2'>{`$${product.price}`}</Typography>

                        {/* Cantidad */}
                        <Box sx={{ my: 2 }}>
                            <Typography variant='subtitle2'>Cantidad</Typography>
                            {/* ItemCounter */}
                            {/* Componente para modificar la cantidad del producto que el usuario quiere*/}
                            <ItemCounter
                                currentValue={tempCartProduct.quantity}
                                onUpdateQuantity={updateQuantity}
                                maxValue={product.inStock}
                            />
                            {/* SizeSelector */}
                            {/* Componente para modificar el tamaño del producto que el usuario quiere*/}
                            <ProductSizeSelector 
                                sizes={product.sizes} 
                                selectedSize={tempCartProduct.size}
                                onSelectedSize={selectedSize}
                            />
                        </Box>

                        {/* Agregar al carrito */}
                        {/* Desabilitamos el boton en caso de que no haya stock */}
                        {
                            product.inStock > 0
                                ? (
                                    /* Si size = undefined el usuario no va a poder agregar al carrito */
                                    tempCartProduct.size
                                        ? (
                                            <Button 
                                                color='secondary' 
                                                className='circular-btn' 
                                                onClick={onAddProduct}
                                            >
                                                Agregar al carrito
                                            </Button>
                                        )
                                        : (
                                            <Button className='circular-btn' variant='outlined' disabled>
                                                Seleccione una talla
                                            </Button>
                                        )
                                )
                                : (
                                    <Chip color='error' variant='outlined' label='No hay disponibles' />
                                )
                        }

                        {/* Descripcion */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant='subtitle2'>Descripcion</Typography>
                            <Typography variant='body2'>{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

/* Otra manera de obtener la informacion de un producto es con getServerSideProps
Sin embargo sigue sin ser la mejor opcion. La mejor opcion es la que se encuentra abajo de esto,
ya que utilizando GSProps y GSPaths crea todas las paginas antes de que la app pueda ser usada */
/* Usamos el snippet 'nextgetSSRProps' para crear el getServerSideProps 
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    
    // Extraemos el slug del ctx.params
    const { slug = '' } = ctx.params as {slug: string}

    // Usamos la funcion que creamos en el database para obtener el producto por su slug
    const product = await dbProducts.getProductBySlug(slug)

    // En caso de que no exista el producto redireccionamos al usuario al HomePage
    if(!product){
        return {
            redirect: {
                destination: '/',
                // Si ponemos el permanent en true estamos diciendo que la pagina nunca va a existir
                // Pero puede que el dia de mañana se cree una pagina con ese slug asi que por eso lo ponemos en false
                permanent: false
            }
        }
    }

    return {
        props: {
            product
        }
    }
}*/

/* Usamos el snippet 'nextgetStaticPaths' para crear el getStaticPaths */
/* Esta funcion la utilizamos solo cuando tengamos una pagina dinamica, es decir que el nombre este entre corchetes */
export const getStaticPaths: GetStaticPaths = async (ctx) => {

    /* Obtenemos el arreglo con todos los slugs
    Anterioremente tuvimos que haber creado la funcion en database */
    const productSlugs = await dbProducts.getAllProductsSlugs()

    return {
        /* Mapeamos el arreglo para crear las paginas
        La cantidad de params que definamos va a ser la cantidad de paths (o paginas) que queremos crear. 
        Todas se crean cuando se hace el build */
        paths: productSlugs.map(prod => ({
            params: {
                /* Los parametros deben coincidir con el nombre del archivo, en este caso slug */
                slug: prod.slug
            }
        })),
        fallback: "blocking"
    }
}

/* Usamos el snippet 'nextgetStaticProps' para crear el getStaticProps */
export const getStaticProps: GetStaticProps = async (ctx) => {

    /* Para acceder a los params del getStaticPaths debemos utilizar ctx */
    /* Le definimos 'as {slug: string}' porque es una manera facil de solucionar un error que nos lanza el slug por no estar definido */
    const { slug = '' } = ctx.params as { slug: string }

    /* Obtenemos el producto segun su slugs
    Anterioremente tuvimos que haber creado la funcion en database */
    const product = await dbProducts.getProductBySlug(slug)

    /* En caso de que no exista el producto redireccionamos al usuario al HomePage */
    if (!product) {
        return {
            redirect: {
                destination: '/',
                /* Si ponemos el permanent en true estamos diciendo que la pagina nunca va a existir
                Pero puede que el dia de mañana se cree una pagina con ese slug asi que por eso lo ponemos en false */
                permanent: false
            }
        }
    }

    return {
        props: {
            product
        },
        /* Lo revalidamos cada 24 horas */
        revalidate: 60 * 60 * 24
    }
}

export default ProductPage