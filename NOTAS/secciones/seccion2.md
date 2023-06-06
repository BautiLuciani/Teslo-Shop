## SECCION 2
## ESTA SECCION ESTA BASADA EN CREAR LA BASE DE DATOS
## PASOS: 
1. Creamos la base de datos en MongoDB Atlas
2. Conectamos la base de datos a MongoDB Compass
3. Creamos el archvio para las variables de entorno (.env)
4. Agregamos el archivo '.env' al '.gitignore'
5. Instalamos mongoose
6. Creamos el modelo de productos con los datos que vayamos a necesitar (models/product.ts)
7. Hacemos la conexion a la base de datos (database/db)
8. Nos conectamos a la base de datos (pages/api/seed.ts)
9. Creamos el RESTAPI para obtener todos los productos (pages/api/products/index.ts)
10. Creamos el RESTAPI para filtrar la consulta por genero (pages/api/products/index.ts)
11. Creamos el RESTAPI para obtener un producto por su slug (pages/api/products/[slug].ts)
12. Creamos el RESTAPI para buscar productos por su titulo o por los tags (pages/api/search/[q].ts)
13. Creamos el archivo que nos muestre un error en caso de que algo haya salido mal en la busqueda (pages/api/search/index.ts)
