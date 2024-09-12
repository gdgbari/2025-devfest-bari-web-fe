
//mantine core is necessary for notifications styling
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export const AppMain = ({ children }:{
    children: React.ReactNode
}) => {
    return (
        <MantineProvider defaultColorScheme='dark'>
            <Notifications />
            {children}
        </MantineProvider>
    );
}