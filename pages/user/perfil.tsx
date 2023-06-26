import { ShopLayout } from '@/components/layouts'
import { db } from '@/database'
import { IUser } from '@/interface'
import { NextPage, GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { Box, Chip, Grid, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar'
import { stringAvatar } from '@/utils'

interface Props {
    user: any
}

const UserPage: NextPage<Props> = ({ user }) => {

    return (
        <ShopLayout title={'Perfil'} pageDescription={'Pagina de perfil del usuario'}>
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='50vh'>
                    <Avatar {...stringAvatar(`${user.name}`)} sx={{ width: 56, height: 56, m:0 }} />
                    <Typography variant='h1' sx={{ mt: 2, mb: 1 }}>{user.name}</Typography>
                    <Typography variant='body1' color='primary'>{user.email}</Typography>
                    <Chip variant='outlined' color='error' label={user.role} sx={{ mt: 1 }}/>
            </Box>
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

    const session: any = await getServerSession(req, res, authOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/user/perfil',
                permanent: false
            }
        }
    }

    const u = JSON.stringify(session)
    const { user } = JSON.parse(u)

    return {
        props: {
            user
        }
    }
}

export default UserPage