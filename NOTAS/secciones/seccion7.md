## SECCION 7
## ESTA SECCION ESTA BASADA EN NEXT AUTH
## PASOS:
1. Instalamos NextAuth
2. Configuramos NextAuth (pages/api/auth/[...nextauth].ts)
3. Envolvemos la _app.tsx en el SessionProvider
4. Obtenemos la informacion de la session (AuthProvider.tsx)
5. Agregamos nuestro sistema de autenticacion personalizada en los proveedores (auth/[...nextauth].ts)
6. Definimos los callbacks (pages/api/auth/[...nextauth].ts)
7. Creamos una funcion para verificar el correo y la constraseña (database/dbUsers.ts)
8. Aplicamos la funcion en el archivo (pages/api/auth/[...nextauth].ts)
9. Logueamos y deslogueamos un usuario basado en 'Credentials' (AuthProvider.tsx)
10. Creamos una funcion para crear un usuario en DB basado en OAuth (database/dbUsers.ts)
11. Aplicamos la funcion en el archivo (pages/api/auth/[...nextauth].ts)
12. Especificamos las Custom Pages en el archivo (pages/api/auth/[...nextauth].ts)
13. Especificamos la duracion de la session en el archivo (pages/api/auth/[...nextauth].ts)
14. Aplicamos el NextAuth en nuestro login page (pages/auth/login.ts)
15. Aplicamos un SSR a nuestra login page (pages/auth/login.ts)
16. Aplicamos el NextAuth en nuestro register page (pages/auth/register.ts)
17. Aplicamos un SSR a nuestra register page (pages/auth/register.ts)
18. Hacemos que aparezcan los proveedores en el login page (pages/auth/login.ts)
19. Creamos un middleware (middleware.ts)