import Head from 'next/head'
import React, { FC, PropsWithChildren } from 'react'
import { SideMenu } from '../ui'
import { AdminNavbar } from '../admin'
import { Box, Typography } from '@mui/material'

/* Es importante que extienda de PropsWithChildren para poder tener los children como props */
interface Props extends PropsWithChildren {
    title: string,
    subtitle: string,
    icon?: JSX.Element
}

const AdminLayout: FC<Props> = ({ title, subtitle, icon, children }) => {
    return (
        <>
            { /* Head */}
            <Head>
                <title>{title}</title>
            </Head>

            { /* Navbar */}
            <nav>
                <AdminNavbar />
            </nav>

            { /* Sidebar */}
            <SideMenu />

            { /* main */}
            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0px 30px'
            }}>
                <Box display='flex' flexDirection='column'>
                    <Typography variant='h1' component='h1'>
                        {icon}
                        {title}
                    </Typography>
                    <Typography variant='h2' sx={{ mb: 1 }}>{subtitle}</Typography>
                </Box>

                <Box className='fadeIn'>
                    {children}
                </Box>
            </main>
        </>
    )
}

export default AdminLayout