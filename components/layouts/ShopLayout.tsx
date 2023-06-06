import Head from 'next/head'
import React, { FC, PropsWithChildren } from 'react'
import { Navbar, SideMenu } from '../ui'

/* Es importante que extienda de PropsWithChildren para poder tener los children como props */
interface Props extends PropsWithChildren {
    title: string,
    pageDescription: string,
    imageFullUrl?: string
}

const ShopLayout: FC<Props> = ({title, pageDescription, imageFullUrl, children}) => {
  return (
    <>
        { /* Todo: Head (next/head) */}
        <Head>
            <title>{ title }</title>
            {/* Definimos los meta ya que le gusta al SEO*/}
            <meta name="description" content={pageDescription} />
            <meta name='og:title' content={title}/>
            <meta name='og:description' content={pageDescription}/>
            {imageFullUrl && (<meta name='og:image' content={imageFullUrl}/>)}
        </Head>

        { /* Todo: Navbar */}
        <nav>
            <Navbar/>
        </nav>

        { /* Todo: Sidebar */}
        <SideMenu/>

        { /* Todo: main */}
        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            {children}
        </main>

        { /* Todo: footer */}
        <footer>

        </footer>
    </>
  )
}

export default ShopLayout