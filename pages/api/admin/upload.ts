/* Podemos usar el snippet 'nextapi' para crear la estructura */
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
// Instalamos y configuramos cloudinary
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '')

type Data = {
    message: string
}

/* Le avisamos a next que no serealice lo que viene en la peticion, para eso debemos definir el bodyParser en false */
export const config = {
    api: {
        bodyParser: false
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return uploadFile(req,res)
    
        default:
            return res.status(400).json({ message: 'Bad Request' })
    }
    
}

const saveFile = async(file: formidable.File): Promise<string>=> {
    /* Utilizamos el siguiente metodo para subir las imagenes a cloudinary 
    De todo la data vamos a necesitar el secure_url el cual contiene la url segura de la imagen */
    const {secure_url} = await cloudinary.uploader.upload(file.filepath)
    return secure_url
}

const parseFiles = async(req: NextApiRequest): Promise<string> => {
    return new Promise( (resolve, reject) => {
        /* Preparamos el formidable para que analice el formulario que estamos mandando 
        El formulario en este momento se encuentra dentro de req */
        const form = new formidable.IncomingForm
        form.parse(req, async(err, fields, files) => {
            /* Si hay un error nos salimos de la fucion */
            if( err ){
                return reject(err)
            }

            /* Creamos una funcion para guardar los archivos
            Almacenamos la url de los archivos y es lo que retornamos */
            const filePath = await saveFile(files.file as formidable.File)
            resolve(filePath)
        })
    })
}

const uploadFile = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    /* Creamos una funcion para parsear todos los archivos */
    const imageUrl = await parseFiles(req)
    return res.status(200).json({ message: imageUrl })

}
