import Fastify from "fastify";
import fs from "node:fs";
import fastifySwagger from "@fastify/swagger";
const fsp = fs.promises;

const fastify = Fastify({
  logger: true,
});

type Envs = {
  SERVICES: string;
  DEFAULT_SERVICE_API_SPEC_ROUTE: string;
}

type ServiceApiSpec = {
  paths: { [key: string]: any };
  components: { schemas: { [key: string]: any } };
}

type ServicesApiSpecs = {
  [serviceName: string]: ServiceApiSpec;
}

async function mergeStaticSpecs() {
  try {
    const envs = fastify.getEnvs<Envs>();
    const services = envs.SERVICES.split(',');

    const defaultServiceApiSpecRoute = envs.DEFAULT_SERVICE_API_SPEC_ROUTE || '/api/spec';

    const servicesSpecs: ServicesApiSpecs = {};

    for (const service of services) {
      const [serviceName, servicePort] = service.split(':');

      if (!serviceName || !servicePort) {
        throw new Error(`Invalid service format: ${service}`);
      }

      const serviceSpecResponse = await fetch(`http://localhost:${servicePort}${defaultServiceApiSpecRoute}`);

      if (!serviceSpecResponse.ok) {
        throw new Error(`Failed to fetch API spec for service ${serviceName} on port ${servicePort}: ${serviceSpecResponse.statusText}`);
      }

      servicesSpecs[serviceName] = (await serviceSpecResponse.json());
    }

    const mergedSpec: {
      openapi: string;
      info: {
        title: string;
        description: string;
        version: string;
      };
      servers: Array<{ url: string; description: string }>;
      paths: { [key: string]: any };
      components: { schemas: { [key: string]: any } };
      tags: Array<{ name: string; description: string }>;
    } = {
      openapi: '3.0.0',
      info: {
        title: 'Jobify Complete API',
        description: 'Combined API documentation for all Jobify services',
        version: '1.0.0'
      },
      servers: services.map(service => {
        const [serviceName, servicePort] = service.split(':');
        return { url: `http://localhost:${servicePort}`, description: `${serviceName} Service` };
      }),
      paths: {},
      components: { schemas: {} },
      tags: services.map(service => {
        const [serviceName] = service.split(':');
        return { name: serviceName, description: `${serviceName} Service API` };
      })
    };

    for (const [serviceName, serviceSpec] of Object.entries(servicesSpecs)) {
      Object.entries(serviceSpec.paths || {}).forEach(([path, methods]) => {
        mergedSpec.paths[path] = methods;
      });

      if (serviceSpec.components?.schemas) {
        Object.entries(serviceSpec.components.schemas).forEach(([key, schema]) => {
          mergedSpec.components.schemas[`${serviceName}_${key}`] = schema;
        });
      }
    }

    return mergedSpec;
  } catch (error) {
    fastify.log.error('Error merging specs:', error);
    throw error;
  }
}

const envFileOptions = {
  schema: {
    type: 'object',
    properties: {
      SERVICES: { type: 'string' },
      DEFAULT_SERVICE_API_SPEC_ROUTE: { type: 'string', default: '/api/spec' }
    },
    required: ['SERVICES', 'DEFAULT_SERVICE_API_SPEC_ROUTE']
  },
  dotenv: true
}

await fastify.register(import("@fastify/env"), envFileOptions);

await fastify.register(fastifySwagger, {
  mode: 'static',
  specification: {
    document: await mergeStaticSpecs()
  }
});

await fastify.register(import("@fastify/swagger-ui"), {
  routePrefix: '/docs'
});

fastify.get("/ping", {
  schema: {
    description: "Ping endpoint",
    tags: ["Health"],
    response: {
      200: {
        description: "Successful response",
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  }
}, async () => {
  return { message: "pong" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();