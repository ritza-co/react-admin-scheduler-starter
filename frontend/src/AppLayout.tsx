import { Layout, AppBar } from 'react-admin';
import { Typography } from '@mui/material';

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <Layout appBar={CustomAppBar}>
        {children}
    </Layout>
);

const CustomAppBar = () => (
    <AppBar>
        <Typography variant="h6" sx={{ flex : 1 }}>
          Property Manager
        </Typography>
    </AppBar>
);