import { ShopLayout } from "@/components/layouts";
import { NextPage, GetServerSideProps } from "next";
import { Box, Typography } from '@mui/material'
import { dbProducts } from "@/database";
import { IProduct } from "@/interface";
import { ProductList } from "@/components/products";

interface Props {
  products: IProduct[],
  foundProduct: boolean,
  query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProduct, query }) => {



  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuentra los mejores productos de Teslo aqui'}>

      <Typography variant="h1" component='h1'>Buscar producto</Typography>
      {
        foundProduct
          ? <Box display='flex'>
              <Typography variant="h2" sx={{ mb: 1 }}>Resultados de:</Typography>
              <Typography variant="h2" sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{query}</Typography>
            </Box>
          : <Box>
              <Box display='flex'>
                <Typography variant="h2" sx={{ mb: 1 }}>No se han econtrado productos relacionados a</Typography>
                <Typography variant="h2" sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{query}</Typography>
              </Box>
              <Typography variant="h2">Otros productos que te podrian interesar:</Typography>
            </Box>
      }

      <ProductList products={products} />
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { query = '' } = ctx.params as { query: string }

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  /* Esta variable la definimos como let ya que en caso de no encontrar los productos relacionados con la busqueda,
  vamos a mostrar otros productos que le podrian interesar al usuario */
  let products = await dbProducts.getProductByTerm(query)
  const foundProduct = products.length > 0

  /* Todo retornar otros productos */
  if (!foundProduct) {
    /* Podemos retornar todos los productos */
    /* products = await dbProducts.getAllProducts() */
    /* O podemos retornar los productos con un termino en especifico */
    products = await dbProducts.getProductByTerm('shirt')
  }

  return {
    props: {
      products,
      foundProduct,
      query
    }
  }
}

export default SearchPage