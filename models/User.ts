import { IUser } from '@/interface'
import mongoose, {Schema, model, Model} from 'mongoose'

/* Definimos que atributos va a incluir el usuario, para eso usamos el Schema
A cada atributo hay que definirle el tipo y si es requerido (opcional) */
const userSchema = new Schema({
    name: {type: String, require: true},
    /* El mail debe ser unico */
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    role: {
        type: String,
        /* Con enum definimos los posibles valores de role */
        enum: {
            values: ['admin', 'client', 'super-user', 'SEO'],
            message: '{VALUE} no es un rol permitido',
            default: 'client',
            required: true
        }
    }
}, {
    /* Usamos el timestamps para que se agreguen los atributos createdAt y updatedAt */
    timestamps: true
})

/* Despues de definir el Schema hay que definir el modelo en mongoose */
const User:Model<IUser> = mongoose.models.User || model('User', userSchema)

export default User