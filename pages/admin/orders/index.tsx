import { AdminLayout } from '@/components/layouts'
import { IOrder, IUser } from '@/interface'
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Box, Chip, CircularProgress, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React from 'react'
import useSWR from 'swr';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 230 },
    { field: 'email', headerName: 'Correo', width: 230 },
    { field: 'name', headerName: 'Nombre Completo', width: 180 },
    { field: 'total', headerName: 'Monto total', width: 100 },
    {
        field: 'isPaid',
        headerName: 'Pagado',
        width: 120,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                row.isPaid
                ? <Chip color="success" label='Pagado' variant="outlined" />
                : <Chip color="error" label='No Pagado' variant="outlined" />
            )
        }
    },
    { field: 'noProducts', headerName: 'No. Productos', align: 'center', width: 120 },
    {
        field: 'check',
        headerName: 'Ver Orden',
        width: 110,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target='_blank'>
                    Ver Orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 200 },
]

const OrdersPage = () => {

    /* Utilizamos useSWR para obtener las ordenes de los usuarios para poder mostrarla en el grid
    Anteriormente creamos la funcion para obtener y modificar usuarios en api/admin/orders */
    const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

    /* A penas carga la pagina data y error van a ser undefined, utilizamos un condicional para evitar este error */
    if (!data && !error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    const rows = data!.map( order => ({
        /* Es importante siempre poner el id por mas que no lo hayamos definido en las columnas*/
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt 
    }))

    return (
        <AdminLayout
            title='Ordenes'
            subtitle='Mantenimiento de ordenes'
            icon={<ConfirmationNumberOutlined />}
        >
            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{ height: 'calc(100vh - 230px)', width: '100%' }}>
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

export default OrdersPage