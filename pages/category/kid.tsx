import { ShopLayout } from '@/components/layouts'
import { ProductList } from '@/components/products'
import { FullScreenLoading } from '@/components/ui'
import { useProduct } from '@/hooks'
import { Typography } from '@mui/material'
import { NextPage } from 'next'

const KidPage: NextPage = () => {

    const {products, isLoading} = useProduct('/products?gender=kid')

  return (
    <ShopLayout title='Teslo-Shop - Kids' pageDescription='Encuentra los mejores productos para niños'>
        <Typography variant="h1" component='h1'>Niños</Typography>
        <Typography variant="h2" sx={{mb: 1}}>Productos para niños</Typography>

        {
            isLoading
            ? <FullScreenLoading/>
            : <ProductList products={products}/>
        }
        
    </ShopLayout>
  )
}

export default KidPage