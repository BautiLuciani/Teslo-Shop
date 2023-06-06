import mongoose from 'mongoose';

// Establecemos la conexion
/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongoConnection = {
    isConnected: 0
}

// Creamos la funcion para conectarnos a la base de datos
export const connect = async() => {

    // si ya esta conectado nos salimos de la funcion
    // que un valor sea igual a 1 es como decir que es true
    if ( mongoConnection.isConnected ) {
        console.log('Ya estabamos conectados');
        return;
    }

    // Puede que hayan quedado conexiones abiertas
    if ( mongoose.connections.length > 0 ) {
        mongoConnection.isConnected = mongoose.connections[0].readyState;

        // Revisamos de que en caso de que ya haya una conexion conectarnos a esa
        if ( mongoConnection.isConnected === 1 ) {
            console.log('Usando conexión anterior');
            return;
        }

        // En caso de que el estado no sea 1 vamos a desconectarnos para evitar tener varias conexiones en simultaneo
        await mongoose.disconnect();
    }

    // Tratamos de conectarnos y en caso de que haya podido cambiamos el valor del isConnected
    await mongoose.connect( process.env.MONGO_URL || '');
    mongoConnection.isConnected = 1;
    console.log('Conectado a MongoDB:', process.env.MONGO_URL );
}

// Creamos la funcion para desconectarnos a la base de datos
export const disconnect = async() => {
    
    if ( process.env.NODE_ENV === 'development' ) return;

    if ( mongoConnection.isConnected === 0 ) return;

    await mongoose.disconnect();
    mongoConnection.isConnected = 0;

    console.log('Desconectado de MongoDB');
}