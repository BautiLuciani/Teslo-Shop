## SECCION 11
## ESTA SECCION ESTA BASADA EN EL MANTENIMIENTO DE PRODUCTOS
## PASOS:
1. Creamos un REST para obtener los productos (pages/api/admin/products.ts)
2. Creamos el ProductsPage para mostrar el listado de productos (pages/admin/products/index.tsx)
3. Creamos la pagina para editar cada producto segun su slug (pages/admin/products/[slug].tsx)
4. Usamos React Hook Form para el control del formulario para editar productos (admin/products/[slug].tsx)
5. Creamos un REST para actualizar los productos (pages/api/admin/products.ts)
6. Aplicamos el REST que creamos para actualizar productos (pages/admin/products/[slug].tsx)
7. Creamos un REST para crear productos (pages/api/admin/products.ts)
8. Aplicamos el REST que creamos para crear un producto (pages/admin/products/[slug].tsx)
9. Instalamos Formidable
10. Instalamos Cloudinary
11. Definimos las varibales de entorno de cloudinary (.env)
12. Creamos un REST para subir los archivos (imagenes) (pages/api/admin/upload.ts)
13. Aplicamos el REST que creamos para subir imagenes (pages/admin/products/[slug].tsx)
14. Realizamos el TODO para eliminar las imagenes de cloudinary (pages/api/admin/products.ts)
15. Creamos el HOST_NAME en las variables de entorno (.env)
16. Realizamos el TODO para procesar las imagenes cuando las subamos al server (database/dbProducts.ts), (pages/api/admin/products.ts), (pages/api/products/index.ts), (pages/api/products/[slug].ts)