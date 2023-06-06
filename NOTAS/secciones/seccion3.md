## SECCION 3
## ESTA SECCION ESTA BASADA EN CONECTAR LA BASE DE DATOS CON EL FRONT
## PASOS:
1. Instalamos SWR
2. Creamos un Custom Hook para SWR (hooks/useProducts.ts)
3. Envolvemos la _app.tsx con el SWRConfig
4. Creamos un archivo para mostrar la pagina de carga (components/ui/FullScreenLoading.tsx)
5. Hacemos que el texto de los productos aparezca una vez que la imagen esta cargada (products/ProductCard.tsx)
6. Creamos las paginas para hombre, mujer y niños (pages/category/men,women,kids)
7. Mostramos en el navbar la pagina activa que nos encontramos (M/W/K) (ui/Navbar.tsx)
8. Creamos un contexto para abrir el Sidebar cuando tocamos en 'menu' (context/ui)
9. Envolvemos la _app.tsx con el UiProvider
10. Creamos la funcion que al clickear 'menu' se abra el Sidebar (ui/Navbar.tsx) / (ui/SideMenu.tsx)
11. Creamos la funcion que al clickear en las opciones 'Hombre/Mujer/Niños' del 'menu' nos redirija a sus paginas respectivas (components/ui/SideMenu.tsx)
12. Creamos un archivo en database donde van a estar las funciones para obtener todos o un producto por slug (database/dbProducts.ts). Cuando hacemos esto es porque seguramente vayamos a crear un SSR / GSProp / GSPath
13. Trabajamos en la pantalla del producto cambiando los datos harcodeados por los del producto ([slug].tsx)
Implementamos el GSProp y el GSPath
14. Le definimos la funcionalidad a la pagina de busqueda para que cuando un usuario busque algo lo redirecione a la pagina con los productos que esten relacionados a lo que el usuario busco (SideMenu.tsx)
15. Creamos una nueva funcion en database para obtener todos los productos por el termino de busqueda que ingresa el usuario (database/dbProducts.ts)
16. Creamos una nueva funcion en database para obtener todos los productos (database/dbProducts.ts)
17. Trabajamos en la pantalla de busqueda de un producto utilizando SSR (search/[query].tsx)
18. Trabajamos en el boton de busqueda para que abra el sidemenu en caso de estar en mobile o que aparezca un input en caso de estas en desktop (ui/Navbar.tsx)