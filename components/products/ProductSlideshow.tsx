import React, { FC } from 'react'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'
import styles from './ProductSlideshow.module.css'

interface Props {
    images: string[]
}

const ProductSlideshow: FC<Props> = ({images}) => {
  return (
    <Slide
        easing='ease'
        duration={7000}
        indicators
    >
        {
            images.map(image => {
                return (
                    /* Hay que poner el className de la siguiente manera ya que sino lanza error por el guion bajo */
                    <div className={styles['ease-slide']} key={image}>
                        <div style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover'
                        }}
                        >

                        </div>
                    </div>
                )
            })
        }
    </Slide>
  )
}

export default ProductSlideshow