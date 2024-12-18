import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import openapiGlue from 'fastify-openapi-glue';
import RouteHandler from './RouteHandler';
import path from 'path';
import { fileURLToPath } from 'url';

const glueOptions = {
  specification: `${path.dirname(fileURLToPath(import.meta.url))}/schema.yaml`,
  service: new RouteHandler(),
  ajvOptions: {
    allErrors: true
  }
};

const fastify = Fastify({ logger: true });

fastify.register(openapiGlue, glueOptions);

/** Shim for catching validation errors and returning 400 */
/** For some reason fastify isn't handling these */
/** Debug someday.... */
fastify.setErrorHandler(function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  _req: FastifyRequest,
  res: FastifyReply
) {
  console.log(err);
  if (err.validation?.length) {
    err.errors = err.validation;
    err.statusCode = 400;
  }
  res.status(err.statusCode || 500).send(err);
});

const PORT = Number(process.env.PORT) || 4000;

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
