## SECCION 4
## ESTA SECCION ESTA BASADA EN EL CARRITO DE COMPRAS
## PASOS:
1. Creamos el contexto para el carrito (context/cart)
2. Creamos la interfaz del carrito (interface/cart.ts)
3. Envolvemos _app.tsx con el CartProvider
4. Mostramos un cartel en caso de que no haya stock (components/products/ProductCard.tsx)
5. Desabilitamos el boton en caso de que no haya stock (pages/products/[slug].tsx)
6. Creamos la funcion para validar que el usuario haya seleccionado una talla (pages/products/[slug].tsx)
7. Creamos la funcion para contar la cantidad de productos que el usuario quiere (products/[slug].tsx)
8. Creamos la funcion para agregar los productos al carrito (pages/products/[slug].tsx)
Para este punto tambien vamos a tener que trabajar en el CartContext
9. Instalamos JS-Cookie y su dependencia
10. Almacenamos el carrito en las cookies (context/cart/CartProvider.tsx)
11. Mostramos los productos del carrito de compras (components/cart/CartList.ts)
12. Creamos la funcion para actualizar la cantidad de productos desde el carrito (cart/CartList.ts) 
Para este punto tambien vamos a tener que trabajar en el CartContext
13. Creamos la funcion para eliminar un producto desde el carrito (cart/CartList.tsx)
Para este punto tambien vamos a tener que trabajar en el CartContext
14. Calculamos los montos a pagar y creamos la funcion para actualizar los datos a pagar
Para este punto tambien vamos a tener que trabajar en el CartContext
15. Colocamos los montos a pagar en la pagina (components/cart/OrderSummary.tsx)
16. Creamos una funcion para formatear los precios y que parezcan precios reales (utils/currency.ts)
17. Cambiamos el globito del carrito el cual marca la cantidad de productos (ui/Navbar.tsx)