import Route from '@ioc:Adonis/Core/Route';

import './book';
import './HealthCheck';

Route.get('/', async () => {
    return { status: true };
});
