import { tesloApi } from '@/api'
import { AdminLayout } from '@/components/layouts'
import { IUser } from '@/interface'
import { PeopleOutline } from '@mui/icons-material'
import { Box, CircularProgress, Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

const UsersPage = () => {

    /* Utilizamos useSWR para obtener la data de los usuarios para poder mostrarla en el grid
    Anteriormente creamos la funcion para obtener y modificar usuarios en api/admin/users */
    const { data, error } = useSWR<IUser[]>('/api/admin/users')

    /* Utilizamos este useState para almacenar la data */
    const [users, setUsers] = useState<IUser[]>([])

    /* Usamos este useEffect para actualizar los usuarios cuando la data cambia */
    useEffect(() => {
      if(data){
        setUsers(data)
      }
    }, [data])

    /* A penas carga la pagina data y error van a ser undefined, utilizamos un condicional para evitar este error */
    if (!data && !error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh)' }}>
                <CircularProgress />
            </Box>
        )
    }

    /* Creamos la funcion para actualizar el rol del usuario */
    const onRoleUpdate = async( userId: string, newRole: string)=> {

        /* En caso de que haya un error necesitamos tener almacenado como estaban los users antes del cambio */
        const previousUsers = users.map( user => ({ ...user }))

        /* Mostramos el nuevo rol en tiempo real, ya que anteriormente habia que recargar la pagina para que aparezca 
        Esto lo podriamos hacer en el try pero a veces tarda en hacer la peticion y nosotros queremos que el nuevo rol se muestre instantaneamente */
        const updatedUser = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }))

        setUsers(updatedUser)

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole})
        } catch (error) {
            /* En caso de que algo salga mal volvemos a setear los users como estaban originalmente */
            setUsers( previousUsers)
            console.log(error);
        }

    }

    /* Creamos las columnas del grid */
    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 400 },
        { field: 'name', headerName: 'Nombre Completo', width: 450 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 400,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label='rol'
                        sx={{ width: '400px' }}
                        /* Utilizamos el onChange para cambiar el rol del usuario
                        Extraemos el target del evento ya que ahi dentro se encuentra el nuevo rol que estamos seleccionando
                        onRoleUpdate va a necesitar dos parametros, el userId y el role
                        Estos dos parametros fueron los que especificamos en el body cuando creamos la api para actualizar el rol del usuario */
                        onChange={({target})=> onRoleUpdate( row.id, target.value)}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>
                        <MenuItem value='super-user'>Super User</MenuItem>
                        <MenuItem value='SEO'>SEO</MenuItem>
                    </Select>
                )
            }
        }
    ]

    /* Creamos las filas del grid */
    const rows = users.map(user => ({
        /* Por mas que no lo especifiquemos en las columnas, cada una tiene un id */
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))

    return (
        <AdminLayout
            title={'Usuarios'}
            subtitle={'Mantenimiento de usuarios'}
            icon={<PeopleOutline />}
        >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 'calc(100vh - 230px)', width: '100%' }}>
                    {/* Utilizamos DataGrid de la libreria @mui/x-data-grid */}
                    <DataGrid
                        /* Columns y Rows son dos atributos que deben ir obligatoriamente */
                        columns={columns}
                        rows={rows}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5 }
                            }
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default UsersPage