const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const fastify = require('fastify');
const Bree = require('bree');
const fp = require('fastify-plugin');

const routes = require('./routes');
const server = fastify();

const {readFile} = require('node:fs/promises');

server.register(fp(async (fastify, opts) => {
  fastify.decorate('config', async () => {
    const config =
      await readFile(
          path.resolve(
              __dirname,
              './jobs/config.json'),
      );

    return JSON.parse(config);
  });
}));

server.register(fp(async (fastify, opts, next) => {
  const bree = new Bree({
    root: path.resolve(__dirname, './jobs'),
  });
  await bree.start();
  fastify.decorate('bree', bree);
  next();
}));

server.register(routes);

server.listen({
  port: process.env.PORT_EVENT,
  host: process.env.HOST,
}, async (err, address) => {
  if (err) {
    throw err;
  }
});
