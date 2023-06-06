## SECCION 6
## ESTA SECCION ESTA BASADA EN LOS ESTILOS CONDICIONALES SEGUN EL ROL DEL USUARIO
## PASOS:
1. Mostramos las opciones del Sidebar en base al rol del usuario (components/ui/SideMenu.tsx)
2. Creamos la funcion para el loggout (context/auth)
3. Aplicamos la funcion del logout (components/ui/SideMenu.tsx)
4. Aplicamos la funcion para redirijir al usuario a la misma pagina luego de logearse (SideMenu.tsx)
5. Mostramos una pagina diferente en caso de que el carrito este vacio (pages/cart/index.ts)
6. !Utilizamos SSR para verificar que haya un usuario logeado para mostrar la pagina (checkout/address.tsx)
6. 1. Importamos jose
6. 2. Creamos un middleware en la raiz del proyecto
7. Trabajamos en el formulario de la direccion (checkout/address.tsx)
8. Creamos una funcion para almacenar la direccion del usuario en el CartContext
9. Creamos una funcion para actualizar la direccion del usuario en el CartContext
10. Mostramos los datos de la direccion sacados del CartContext (checkout/summary.tsx)