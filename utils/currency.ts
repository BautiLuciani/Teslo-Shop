/* Este proceso tambien lo podriamos hacer con una libreria, pero lo vamos a trabajar con el metodo propio de js */
/* Esta es la documenacion https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl */

/* Creamos la funcion para transformar montos */
export const format = ( value: number ) => {
    // Creamos el formateador
    // NumberFormat va a recibir cual es el nombre del pais que queremos la moneda
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    })

    return formatter.format( value )
}