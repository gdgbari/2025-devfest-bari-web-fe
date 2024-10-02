
//mantine core is necessary for notifications styling
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient()

export const AppMain = ({ children }:{
    children: React.ReactNode
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider defaultColorScheme='dark'>
                <Notifications />
                {children}
            </MantineProvider>
        </QueryClientProvider>
    );
}