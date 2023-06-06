## SECCION 5
## ESTA SECCION ESTA BASADA EN CREAR UNA AUTENTICACION PERSONALIZADA MEDIANTE JWT
## PASOS:
1. Definimos como queremos que luzcan los usuarios en la aplicacion (models/User.ts)
2. Definimos la interfaz del usuario (interface/user.ts)
3. Creamos usuarios de prueba (database/seed-data.ts) // antes el seed-data.ts se llamaba products.ts
4. Insertamos los usuarios de prueba en la base de datos (api/seed.ts)
5. Instalamos Bcrypt para encriptar las contraseñas (database/seed-data.ts)
6. Instalamos jsonwebtoken
7. Creamos un archivo para generar el JWT (utils/jwt.ts)
8. Creamos un REST para verificar si un usuario tiene cuenta o no (api/user/login.ts)
9. Creamos un archivo para verificar los emails (utils/validations.ts)
10. Creamos un REST para registrar un nuevo usuario (api/user/register.ts)
11. Validamos el JWT para poder usarlo desde el front (api/user/validateToken.ts)
12. Instalamaos react-hook-form
13. Trabajamos en el formulario del login (pages/auth/login.ts)
14. Instalamos axios
15. Realizamos las validaciones contra el backend (pages/auth/login.ts)
16. Trabajamos en el formulario del registro (pages/auth/register.ts)
17. Creamos el AuthContext (context/auth)
18. Envolvemos el AuthProvider en el _app.tsx
19. Utilizamos las funciones que creamos en el AuthContext (pages/auth/login-register)