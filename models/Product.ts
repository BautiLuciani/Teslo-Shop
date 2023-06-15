import { IProduct } from '@/interface'
import mongoose, {Schema, model, Model} from 'mongoose'

/* Definimos que atributos va a incluir el producto, para eso usamos el Schema
A cada atributo hay que definirle el tipo y si es requerido (opcional) */
const productSchema = new Schema({
    description: {type: String, require: true, default: ''},
    /* Como es mas de una imagen debemos ponerlo dentro de un arreglo */
    images: [{type: String}],
    inStock: {type: Number, require: true, default: 0},
    price: {type: Number, require: true, default: 0},
    sizes: [{
        type: String,
        /* Con enum definimos los posibles valores de sizes */
        enum: {
            values: ['XS','S','M','L','XL','XXL','XXXL'],
            /* Podemos definir un mensaje en caso de que quieran pasar un valor que no esta incluido dentro de los valores posibles */
            message: '{VALUE} no es un tamaño valido'
        }
    }],
    /* Es muy importante que le definamos el 'unique' al slug para que sea unico */
    slug: {type: String, require: true, unique: true},
    /* Los tags nos van a ayudar con la busqueda de productos
    Vamos a mostrar productos en base a los tags y los titulos que el usuario estuvo buscando
    Como son varios tags hay que ponerlo dentro de un arreglo */
    tags: [{type: String}],
    title: {type: String, require: true, default: ''},
    /* A diferencia de los sizes, el type solo puede ser uno por eso no esta dentro de un arreglo */
    type: {
        type: String,
        enum: {
            values: ['shirts','pants','hoodies','hats'],
            message: '{VALUE} no es un tipo valido'
        },
        default: 'shirts'
    },
    gender: {
        type: String,
        enum: {
            values: ['men','women','kid','unisex'],
            message: '{VALUE} no es un genero valido'
        },
        default: 'men'
    }
}, {
    /* Con esta propiedad mongoose nos ayuda a acceder facilmente a la fecha de creacion y la fecha de actualizacion */
    timestamps: true
})

// TODO: Crear indice de Mongo
/* Con este indice podemos buscar palabras que se encuentren en los parametros que le pasemos, 
en este caso el titulo y los tags los cuales son de indice 'text' */
productSchema.index({title: 'text', tags: 'text'})

/* Creamos un modelo de producto de tipo IProduct
En caso de que ya exista ese modelo lo vamos a utilizar, caso contrario vamos a crear uno el cual incluya el productSchema */
const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema) 

export default Product
