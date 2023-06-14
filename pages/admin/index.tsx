import { SummaryTile } from '@/components/admin'
import { AdminLayout } from '@/components/layouts'
import { DashboardSummaryResponse } from '@/interface'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const AdminPage = () => {

    /* Utilizamos useSWR para llamar a la api que creamos anteriormente en api/admin/dashboard
    En la configuracion vamos a definir refreshInterval el cual es el tiempo que queremos que vuelva a llamar al endpoint
    La data va a ser del tipo DashboardSummaryResponse, el cual tuvimos que haber definido anteriormente en las interfaces */
    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 100 // 30 segundos
    })

    /* Utilizamos un useState para almacenar la cantidad de segundos que van para luego mostrarlos
    Los segundos hacen referencia a el tiempo que falta para que se refresque la data */
    const [refreshIn, setRefreshIn] = useState(30)

    /* Utilizamos un useEffect para restar los segundos del estado, y que cuando llegue a 0 vuelva a 30 */
    useEffect(() => {
      const interval = setInterval(()=> {
        setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
      }, 1000 /* cada segundo */ )
    
      return () => {
        clearInterval(interval)
      }
    }, [])
    

    /* A penas carga la pagina data y error van a ser undefined, utilizamos un condicional para evitar este error */
    if (!data && !error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh-200px)' }}>
                <CircularProgress />
            </Box>
        )
    }

    /* En caso de que nos devuelva un error mostramos un mensaje */
    if (error) {
        console.log(error);
        return <Typography>Error al cargar la informacion</Typography>
    }

    /* Extraemos todas las propiedades de data */
    const {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productWithNoInventory,
        lowInventory
    } = data!

    return (
        <AdminLayout
            title='Dashboard'
            subtitle='Estadisiticas generales'
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={2}>
                <SummaryTile
                    title={numberOfOrders}
                    subtitle='Ordenes totales'
                    icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />
                <SummaryTile
                    title={paidOrders}
                    subtitle='Ordenes pagadas'
                    icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
                />
                <SummaryTile
                    title={notPaidOrders}
                    subtitle='Ordenes pendientes'
                    icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
                />
                <SummaryTile
                    title={numberOfClients}
                    subtitle='Clientes'
                    icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
                />
                <SummaryTile
                    title={numberOfProducts}
                    subtitle='Productos'
                    icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
                />
                <SummaryTile
                    title={productWithNoInventory}
                    subtitle='Sin Existencias'
                    icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
                />
                <SummaryTile
                    title={lowInventory}
                    subtitle='Bajo inventario'
                    icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
                />
                <SummaryTile
                    title={refreshIn}
                    subtitle='Actualizacion en: '
                    icon={<AccessTimeOutlined color='warning' sx={{ fontSize: 40 }} />}
                />
            </Grid>
        </AdminLayout>
    )
}

export default AdminPage