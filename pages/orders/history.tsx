import { ShopLayout } from "@/components/layouts"
import { Typography, Grid, Chip, Link } from '@mui/material';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid'
import NextLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { dbOrders } from "@/database";
import { IOrder } from "@/interface";

/* Las columnas deben ser de tipo GridColDef[] */
const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'fullname', headerName: 'Nombre completo', width: 200},
    {
        field: 'paid', 
        headerName: 'Estado', 
        width: 200,
        description: 'Estado de la orden',
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                ? <Chip color="success" label='Pagado' variant="outlined"/>
                : <Chip color="error" label='No Pagado' variant="outlined"/>
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver Orden',
        width: 100,
        /* Con sortable en false el usuario no puede ordenar los campos en base a este field */
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
                    <Link underline="always">
                        Ver Orden
                    </Link>
                </NextLink>
            )
        }
    }
]

interface Props {
    orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows = orders.map( (order, index) => ({
        id: index + 1, 
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, 
        paid: order.isPaid, 
        orderId: order._id
    }))

  return (
    <ShopLayout title={"Historial de ordenes"} pageDescription={"Historial de ordenes del usuario"}>
        <Typography variant="h1" component='h1' sx={{mb: 2}}>Historial de ordenes</Typography>

        <Grid container className="fadeIn">
            <Grid item xs={12} sx={{height: 'calc(100vh - 150px)', width: '100%'}}>
                {/* Utilizamos DataGrid de la libreria @mui/x-data-grid */}
                <DataGrid
                    /* Columns y Rows son dos atributos que deben ir obligatoriamente */ 
                    columns={columns} 
                    rows={rows}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 5}
                        }
                    }}   
                    pageSizeOptions={[5, 10, 25]}             
                />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    
    /* Obtenemos la session del usuario */
    const session: any = await getServerSession(req, res, authOptions)
    /* session nos devuelve un [object Object] por eso lo trabajamos de la siguiente manera y extraemos user */
    const {user} = JSON.parse(JSON.stringify(session))

    /* En caso de que no exista un usuario lo redirijimos a la pagina de login */
    if(!user){
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    /* Obtenemos todas las ordenes que coincidan con el id del usuario
    Para eso tuvimos que haber creado la funcion anteriormente en database */
    const orders = await dbOrders.getOrderByUsers( user.id )

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage