
export interface IUser {
    _id: string;
    name: string;
    email: string;
    /* El password lo ponemos como opcional porque no va a ser un dato que vayamos a usar en el front */
    password?: string;
    role: string;

    // Gracias al timestemp (de models/user) tenemos estos dos atributos
    createdAt: string;
    updatedAt: string
}
