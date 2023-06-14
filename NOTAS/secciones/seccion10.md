## SECCION 10
## ESTA SECCION ESTA BASADA EN EL PANEL DE ADMINISTRACION
## PASOS:
1. Creamos al AdminLayout (components/layouts/AdminLayout.tsx)
2. Creamos el AdminNavbar (components/admin/Navbar.tsx)
3. Creamos el AdminPage (pages/admin/index.tsx)
4. Creamos las cards para el AdminPage (components/admin/SummaryTile.tsx)
5. Creamos un REST para obtener los datos que vamos a utilizar en AdminPage (pages/api/admin/dashboard.ts)
6. Creamos la interfaz de como va a ser la data que nos devuelve el REST ya que la vamos a necesitar para el proximo punto (interfaces/dashboard.ts)
7. Reemplazamos la data del AdminPage por lo que nos trae el REST que creamos (pages/admin/index.tsx)
8. Creamos un middleware para que solo los admin puedan acceder al dashboard (middleware.ts)
9. Creamos un REST para el mantenimiento de usuarios (pages/api/admin/users.ts)
10. Creamos la pagina para el mantenimiento de usuarios (pages/admin/users.tsx)
11. Creamos un REST para obtener todas las ordenes (pages/api/admin/orders.ts)
12. Creamos el OrderPage (pages/admin/orders/index.tsx)
13. Creamos la pagina que muestre la orden segun el id (pages/admin/orders/[id].tsx)
