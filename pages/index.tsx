import { ShopLayout } from "@/components/layouts";
import { NextPage } from "next";
import { Typography } from '@mui/material'
import { ProductList } from "@/components/products";
import { useProduct } from "@/hooks";
import { FullScreenLoading } from "@/components/ui";

const Home: NextPage = ()=> {

  const {products, isLoading} = useProduct('/products')

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo aqui'}>
        {/* Es importante definir 'component' con el valor h1 para que la pagina sepa que es un titulo y una palabra clave en la aplicacion */}
        <Typography variant="h1" component='h1'>Tienda</Typography>
        <Typography variant="h2" sx={{mb: 1}}>Todos los productos</Typography>

        {
          isLoading
          ? <FullScreenLoading/>
          : <ProductList products={products}/>
        }
    </ShopLayout>
  )
}

export default Home