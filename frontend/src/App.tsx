import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import i18nProvider from './i18nProvider';
import { AppLayout } from './AppLayout';
import { ReactAdminScheduler } from './ReactAdminScheduler';
import './App.css';

const App = () => (
    <Admin
        dataProvider={simpleRestProvider('http://localhost:1337/api')}
        i18nProvider={i18nProvider}
        layout={AppLayout}
        darkTheme={null}
    >
        <Resource
            name="events"
            list={
                ReactAdminScheduler
            }
            options={{ label : 'Bookings' }}
        />
    </Admin>
);

export default App;