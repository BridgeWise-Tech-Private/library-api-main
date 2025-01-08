import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';

export default class ApiKeyRequiredMiddleware {
    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>): Promise<void> {
        /**
         * Middleware logic goes here (before the next call)
         */
        const sentApiKey = request.header('api-key');

        if (sentApiKey !== Env.get('CLIENT_API_KEY')) {
            return response.unauthorized();
        }
        return next();
    }
}