import { ShopLayout } from "@/components/layouts"
import { Typography, Grid, Chip, Link } from '@mui/material';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid'
import NextLink from 'next/link'

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
                <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
                    <Link underline="always">
                        {params.row.orden}
                    </Link>
                </NextLink>
            )
        }
    }
]

const rows = [
    {id: 1, fullname: 'Bautista Luciani', paid: true, orden: 'Ver Orden'},
    {id: 2, fullname: 'Matias Rejes', paid: true, orden: 'Ver Orden'},
    {id: 3, fullname: 'Tobias Bullrich', paid: false, orden: 'Ver Orden'},
    {id: 4, fullname: 'Joaquin Sanchez', paid: false, orden: 'Ver Orden'},
    {id: 5, fullname: 'Marco Gotta', paid: true, orden: 'Ver Orden'},
    {id: 6, fullname: 'Tomas Cafferata', paid: false, orden: 'Ver Orden'},
]

const HistoryPage = () => {
  return (
    <ShopLayout title={"Historial de ordenes"} pageDescription={"Historial de ordenes del usuario"}>
        <Typography variant="h1" component='h1' sx={{mb: 2}}>Historial de ordenes</Typography>

        <Grid container>
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

export default HistoryPage