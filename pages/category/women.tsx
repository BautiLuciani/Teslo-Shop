import { ShopLayout } from '@/components/layouts'
import { ProductList } from '@/components/products'
import { FullScreenLoading } from '@/components/ui'
import { useProduct } from '@/hooks'
import { Typography } from '@mui/material'
import { NextPage } from 'next'

const WomenPage: NextPage = () => {

    const {products, isLoading} = useProduct('/products?gender=women')

  return (
    <ShopLayout title='Teslo-Shop - Women' pageDescription='Encuentra los mejores productos para mujeres'>
        <Typography variant="h1" component='h1'>Mujeres</Typography>
        <Typography variant="h2" sx={{mb: 1}}>Productos para mujeres</Typography>

        {
            isLoading
            ? <FullScreenLoading/>
            : <ProductList products={products}/>
        }
        
    </ShopLayout>
  )
}

export default WomenPage