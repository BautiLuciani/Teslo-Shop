import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"
import NextLink from 'next/link'
import { ItemCounter } from "../ui"
import { FC, useContext } from "react"
import { CartContext } from "@/context"
import { ICartProduct, IOrderItem } from "@/interface"

interface Props {
    editable?: boolean
    products?: IOrderItem[]
}

const CartList: FC<Props> = ({ editable, products  }) => {

    /* Traemos el cart del CartContext para mapearlos y mostrarlos en pantalla */
    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext)

    /* Creamos la funcion para actualizar la cantidad de productos */
    const updateQuantity = (product: ICartProduct, newValue: number)=> {
        product.quantity = newValue
        updateCartQuantity(product)
    }

    /* Si tenemos la variable 'product' significa que estamos en la pagina de revision de orden ya que es la unic que le pasa valores al product
    Si estamos en otra pagina entonces lo que se va a mostrar es el cart, ya que el resto de las paginas no le mandan la propiedad product */
    const showProducts = products ? products : cart

    return (
        <>
            {
                showProducts.map(product => (
                    /* Al key le sumamos el product.size ya que pueden haber mas de un elemento con el mismo slug, y el key debe ser unico */
                    <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            <NextLink href={`product/${product.slug}`} passHref legacyBehavior>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia
                                            image={`/products/${product.image}`}
                                            component='img'
                                            sx={{ borderRadius: '5px' }}
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant="body1">{product.title}</Typography>
                                <Typography variant="body1">Talla: <strong>{product.size}</strong></Typography>

                                {/* Condicional */}
                                {
                                    editable 
                                    ? <ItemCounter 
                                        currentValue={product.quantity} 
                                        maxValue={9} 
                                        onUpdateQuantity={(value) => updateQuantity(product as ICartProduct, value)}                                         
                                    />
                                    : <Typography variant='h6'>{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</Typography>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' flexDirection='column' alignItems='center'>
                            <Typography variant="subtitle1">{`$${product.price}`}</Typography>

                            {/* Editable */}
                            {
                                editable &&
                                (
                                    <Button 
                                        variant="text" 
                                        color="secondary"
                                        /* Ejecutamos la funcion para eliminar el producto */
                                        /* Lo tratamos como ICartProduct porque IOrderItem viene de [id].ts el cual envia editable en false, entonces no entra en esta accion */
                                        onClick={()=> removeCartProduct(product as ICartProduct)}
                                    >
                                        Remover
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}

export default CartList