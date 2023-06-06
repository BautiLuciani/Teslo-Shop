import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { useContext } from 'react'
import { AuthContext, UiContext } from "@/context"
import { useRouter } from "next/router"
import { useState } from 'react';

const SideMenu = () => {

  /* Creamos este state para controlar lo que el usuario escribe en el input para buscar un producto */
  const [searchTerm, setSearchTerm] = useState('')

  /* Usamos el AuthContext para extraer si el usuario esta loggeado y el rol del usuario
  En base a estas dos cosas varian las opciones del Sidebar
  Tambien vamos a extraer la funcion onLogout para desloguearse */
  const { isLoggedIn, user, onLogout } = useContext(AuthContext)

  /* Creamos la funcion para redirijir al usuario con lo que busco */
  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return

    navigateTo(`/search/${searchTerm}`)
  }

  /* Utilizamos el router para navegar a las distintas paginas cuando hacemos click en Hombre/Mujeres/Niños 
  Tambien vamos a usar el asPath para recordar donde estaba el usuario y poder redirigirlo a la misma pagina luego de que se logue */
  const router = useRouter()

  /* Creamos el context para extraer el isMenuOpen y asi poder abrir y cerrar el Sidebar 
  Ademas extraemos toogleSideMenu para cerrar el Sidebar cuando navegamos a otra pagina */
  const { isMenuOpen, toggleSideMenu } = useContext(UiContext)

  /* Creamos la funcion para navegar a las distintas paginas de generos */
  const navigateTo = (url: string) => {
    toggleSideMenu()
    /* Utilizamos el metodo push de router para navegar a las distintas paginas pasadas por parametro*/
    router.push(url)
  }



  return (
    /* El drawer sirve para crear el Sidebar */
    <Drawer
      open={isMenuOpen}
      anchor='right'
      /* backdropFilter sirve para hacer borrosa la pagina cuando se entra al sidebar
      Le agregamos una transicion para que se vea mas lindo */
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
      /* Usamos el onClose para cerrar el sidebar cuando hacemos click afuera */
      onClose={toggleSideMenu}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              /* Con el autofocus vamos a poder escribir directo en el input cuando se abra el sidebar */
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              /* Utilizamos el onKeyUp para que al apretar enter se ejecute la funcion onSearchTerm() */
              onKeyUp={e => e.key == 'Enter' ? onSearchTerm() : null}
              type='text'
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    /* Al hacer click en la lupa tambien ejecuta la funcion onSearchTerm() */
                    onClick={onSearchTerm}
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {
            isLoggedIn &&
            <>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={'Perfil'} />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Mis Ordenes'} />
              </ListItemButton>
            </>
          }

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            /* Usamos el onclick para navegar a la pagina segun el genero 
            Hacemos lo mismo con los otros generos */
            onClick={() => navigateTo('/category/men')}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItemButton>

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/women')}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItemButton>

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/kid')}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItemButton>

          {
            isLoggedIn
              ? <ListItemButton onClick={ onLogout }>
                  <ListItemIcon>
                    <LoginOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Salir'} />
                </ListItemButton>
              /* Ponemos el path en el que nos encontramos ahora para despues extraerlo y redirijir al usuario a la pagina que estaba
              Vamos a tener que modificar la funcion del login que se encuntra en auth/login */
              : <ListItemButton onClick={()=> navigateTo(`/auth/login?p=${router.asPath}`)} >
                  <ListItemIcon>
                    <VpnKeyOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Ingresar'} />
                </ListItemButton>
          }

          {/* Admin */}
          {/* Solo mostramos estas opciones en caso de que el rol del usuario sea admin */}
          {
            isLoggedIn && user?.role === 'admin' &&
            <>
              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItemButton>
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={'Productos'} />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Ordenes'} />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
              </ListItemButton>
            </>
          }

        </List>
      </Box>
    </Drawer>
  )
}

export default SideMenu
