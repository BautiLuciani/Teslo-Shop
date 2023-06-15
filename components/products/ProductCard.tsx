import { IProduct } from '@/interface'
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import React, { FC, useMemo, useState } from 'react'
import NextLink from 'next/link'
import { RemoveCircle } from '@mui/icons-material';

interface Props {
    /* Como solo es un producto no lo ponemos como arreglo */
    product: IProduct
}

const ProductCard: FC<Props> = ({ product }) => {

    /* Este estado lo creamos para saber si el mouse se encuentra por encima de la card
    En caso de que se encuentre por encima deberia cambiar la imagen del card */
    const [isHovered, setIsHovered] = useState(false)
    /* Este estado lo creamos para saber si la imagen termino de cargar o no
    En caso de que haya terminado de cargar ahi mostramos el titulo del producto
    Esto es para evitar que se muestren los titulos antes de que cargue la imagen ya que se ve feo */
    const [imageLoaded, setImageLoaded] = useState(false)

    /* Con esta variable mostramos la imagen en base a si esta el mouse por encima o no */
    const productImage = useMemo(() => {
        return isHovered
            ? product.images[1]
            : product.images[0]
    }, [isHovered, product.images])

    return (
        <Grid item
            xs={6} sm={4}
            /* Se ejecuta cuando el mouse pasa por arriba del grid */
            onMouseEnter={() => setIsHovered(true)}
            /* Se ejecuta cuando el mouse sale del grid */
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref legacyBehavior prefetch={false}>
                    <Link>
                        <CardActionArea>
                            {/* En caso que no haya stock mostramos un cartel de 'sin stock'*/}
                            {
                                product.inStock === 0
                                && <Chip
                                        color='error'
                                        variant='outlined'
                                        label='Sin stock'
                                        icon={<RemoveShoppingCartOutlinedIcon />}
                                        sx={{position: 'absolute', zIndex: 99, top: '10px', right: '10px'}}
                                    />
                            }

                            <CardMedia
                                component='img'
                                className='fadeIn'
                                image={productImage}
                                alt={product.title}
                                /* Con el onLoad podemos ejecutar una funcion cuando la imagen haya terminado de cargar */
                                onLoad={() => setImageLoaded(true)}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>
            {/* Con el display hacemos que el titulo se muestre una vez que haya cargado la imagen */}
            <Box sx={{ mt: 1, display: imageLoaded ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={500}>{`$${product.price}`}</Typography>
            </Box>
        </Grid>
    )
}

export default ProductCard