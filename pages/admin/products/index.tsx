import { AdminLayout } from '@/components/layouts'
import { IProduct } from '@/interface'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
import { Box, CircularProgress, Grid, CardMedia, Link, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr';
import NextLink from 'next/link'

const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Imagen',
        renderCell: ({row}: GridRenderCellParams) => {
            return (
                /* Utilizamos 'a' en vez de 'NextLink' porque no queremos que nos redirija en la misma pantalla sin o que nos cambie de ventana */
                <a href={`/product/${row.slug}`} target='_blank'>
                    <CardMedia
                        component='img'
                        alt={row.title}
                        className='fadeIn'
                        image={row.img}
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Titulo', 
        width: 300, 
        renderCell: ({row}: GridRenderCellParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref legacyBehavior >
                    <Link underline='always'>
                        {row.title}
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Genero', width: 160},
    { field: 'type', headerName: 'Tipo', width: 160},
    { field: 'inStock', headerName: 'Inventario', width: 160},
    { field: 'price', headerName: 'Precio', width: 160},
    { field: 'sizes', headerName: 'Tallas', width: 250},
]

const ProductsPage = () => {

    /* Utilizamos useSWR para obtener las ordenes de los usuarios para poder mostrarla en el grid
    Anteriormente creamos la funcion para obtener y modificar usuarios en api/admin/products */
    const { data, error } = useSWR<IProduct[]>('/api/admin/products')

    /* A penas carga la pagina data y error van a ser undefined, utilizamos un condicional para evitar este error */
    if (!data && !error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    const rows = data!.map( product => ({
        /* Es importante siempre poner el id por mas que no lo hayamos definido en las columnas*/
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
    }))

    return (
        <AdminLayout
            title={`Productos (${data?.length})`}
            subtitle='Mantenimiento de productos'
            icon={<CategoryOutlined/>}
        >
            <Box display='flex' justifyContent='end' sx={{ mb: 2}}>
                <Button
                    startIcon={ <AddOutlined/> }
                    color='secondary'
                    /* Podriamos usar un NextLink, pero en este caso usamos href para que nos redirija en una nueva ventana 
                    Enviamos la bandera 'new' en la url para diferenciar si queremos actualizar un producto o crear uno nuevo */
                    href='/admin/products/new'
                >
                    Crear Producto
                </Button>
            </Box>

            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{ width: '100%' }}>
                    {/* Utilizamos DataGrid de la libreria @mui/x-data-grid */}
                    <DataGrid
                        /* Columns y Rows son dos atributos que deben ir obligatoriamente */
                        columns={columns}
                        rows={rows}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5 }
                            }
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default ProductsPage