import { ISize } from "@/interface"
import { Box, Button } from "@mui/material"
import { FC } from "react"


interface Props {
    sizes: ISize[],
    selectedSize?: ISize,

    // Metodos
    onSelectedSize: (size: ISize) => void
}

const ProductSizeSelector: FC<Props> = ({sizes, selectedSize, onSelectedSize}) => {
  return (
    <Box>
        {
            sizes.map(size => (
                <Button
                    key={size}
                    size="small"
                    color={selectedSize === size ? 'primary' : 'info'}
                    onClick={ ()=> onSelectedSize(size) }
                >  
                    {size}
                </Button>
            ))
        }
    </Box>
  )
}

export default ProductSizeSelector