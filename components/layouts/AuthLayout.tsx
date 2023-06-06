import { AppBar, Box, Link, Toolbar, Typography } from '@mui/material'
import Head from 'next/head'
import React, { FC, PropsWithChildren } from 'react'
import NextLink from 'next/link'

interface Props extends PropsWithChildren {
    title: string
}

const AuthLayout: FC<Props> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <nav>
                <AppBar>
                    <Toolbar>
                        <NextLink href={'/'} passHref legacyBehavior>
                            <Link display='flex' alignItems='center'>
                                <Typography variant='h4' color='secondary'>Teslo |</Typography>
                                <Typography sx={{ ml: 0.5 }} variant='h6'>Shop</Typography>
                            </Link>
                        </NextLink>
                    </Toolbar>
                </AppBar>
            </nav>

            <main>
                <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 15px)'>
                    {children}
                </Box>
            </main>
        </>
    )
}

export default AuthLayout