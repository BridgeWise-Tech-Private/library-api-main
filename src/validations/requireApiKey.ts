import { type FastifyRequest } from 'fastify';
import config from '#src/config';
import errors from '#errors/index';

const { UnauthorizedError } = errors;

const requireApiKey = (req: FastifyRequest): void => {
  const apiKey = req.headers[config.demoApiKeyKey];

  if (!apiKey || apiKey !== config.demoApiKeyVal) {
    throw new UnauthorizedError();
  }
};

export default requireApiKey;
