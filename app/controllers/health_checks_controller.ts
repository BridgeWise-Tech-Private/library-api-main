import { healthChecks } from '#start/health';
import type { HttpContext } from '@adonisjs/core/http';

export default class HealthChecksController {
  public async handle({ response }: HttpContext): Promise<void> {
    const report = await healthChecks.run();

    if (report.isHealthy) {
      return response.ok(report);
    }

    return response.serviceUnavailable(report);
  }
}