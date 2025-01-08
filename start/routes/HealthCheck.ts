import Route from '@ioc:Adonis/Core/Route';
import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import { HttpContext } from '@adonisjs/core/build/standalone';
import Env from '@ioc:Adonis/Core/Env';

Route.get('health', async ({ response }) => {
    const report = await HealthCheck.getReport();

    return report.healthy
        ? response.ok(report)
        : response.badRequest(report);
})
    .middleware(({ request, response }: HttpContext, next) => {
        if (request.header('x-monitoring-secret') === Env.get('HEALTH_CHECK_API_KEY')) {
            return next();
        }
        response.unauthorized();
    });
