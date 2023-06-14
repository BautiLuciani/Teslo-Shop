## SECCION 9
## ESTA SECCION ESTA BASADA EN LOS PAGOS CON PAYPAL Y TARJETA DE CREDITO
## PASOS:
1. Aplicamos modificaciones adicionales en la orden (models/Order.ts)
2. Configuramos Paypal Dashboard (Para eso ver el video en el curso)
3. Creamos las variables de entorno para Paypal (.env)
4. Instalamos @paypal/react-paypal-js
5. Envolvemos la app en el Paypal Provider (_app.tsx)
6. Agregamos el boton para pagar con Paypal (pages/orders/[id].tsx)
7. Creamos un REST para verificar el pago desde el back (pages/api/orders/pay.ts)
8. Creamos una interfaz para definir el body de la data que trae paypal (interfaces/paypal.ts)
9. Creamos una funcion para obtener los datos de la orden pagada (pages/orders/[id].tsx)