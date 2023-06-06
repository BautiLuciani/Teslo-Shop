## INICIO DEL PROYECTO
1. Creacion del proyecto → yarn create next-app --typescript
2. Abrimos el proyecto en VSC → code .
3. Ejecutamos el programa → yarn dev
4. Limpieza de archivos:
    a. Todo lo que esta dentro del return en el archivo pages/index.tsx
    b. styles/Home-modules.css
    c. Borramos lo que se encuentra dentro de styles/globals.css pero no el archivo

## CONFIGURACIONES
1. Configuramos la fuente de MaterialUI colocando el font dentro de pages/_document.tsx
2. Agregamos las 4 carpetas que paso el profe a la raiz del proyecto (copy folders → replace → replace)
    Dentro de las carpetas estan: 
        a. Database → se encuentran todos los productos
        b. Styles → se encuentran los estilos globales
        c. Themes → se encuentran los temas de la pagina
3. Envolver la app con el ThemeProvider (@mui/material) en el archivo _app.tsx
4. Colocar el CssBaseline (@mui/material) dentro del ThemeProvider en el archivo _app.tsx