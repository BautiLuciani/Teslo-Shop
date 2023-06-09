import { IOrder } from "@/interface";
import mongoose, { Model, Schema, model } from "mongoose";

/* Definimos que atributos va a incluir las ordenes, para eso usamos el Schema
A cada atributo hay que definirle el tipo y si es requerido (opcional) */
const orderSchema = new Schema({

    /* Como el usuario hace referencia al modelo de 'User' definimos el type como Schema.Types.ObjectId */
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    /* Como el producto hace referencia al modelo de 'Product' definimos el type como Schema.Types.ObjectId */
    orderItems: [{
        _id: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
        title: { type: String, require: true },
        size: { type: String, require: true },
        quantity: { type: Number, require: true },
        slug: { type: String, require: true },
        image: { type: String, require: true },
        price: { type: Number, require: true },
        gender: { type: Number, require: true }
    }],
    shippingAddress: {
        firstName: { type: String, required: true},
        lastName: { type: String, required: true},
        address: { type: String, required: true},
        address2: { type: String },
        zip: { type: String, required: true},
        city: { type: String, required: true},
        country: { type: String, required: true},
        phone: { type: String, required: true}
    },
    paymentMethod: { type: String },
    numberOfItems: { type: Number, require: true },
    subTotal: { type: Number, require: true },
    tax: { type: Number, require: true },
    total: { type: Number, require: true },
    isPaid: { type: Boolean, require: true, default: false },
    paidAt: { type: String }
    
}, {
    /* Usamos el timestamps para que se agreguen los atributos createdAt y updatedAt */
    timestamps: true
})

/* Despues de definir el Schema hay que definir el modelo en mongoose */
const Order: Model<IOrder> = mongoose.models.Order || model('Order', orderSchema)

export default Order