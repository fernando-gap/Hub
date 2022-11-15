const fastify = require('fastify');
const Bree = require('bree');
const fp = require('fastify-plugin');

const routes = require('./routes');
const server = fastify();

const path = require('path');
const { readFile } = require('node:fs/promises');

server.register(fp(async (fastify, opts) => {
  fastify.decorate('config', async () => {
    let config = await readFile(path.resolve(__dirname, './jobs/config.json'));
    return JSON.parse(config);
  })
}))

server.register(fp(async (fastify, opts, next) => {
  const bree = new Bree({
    //logger: console
  });
  await bree.start();
  fastify.decorate('bree', bree);
  next();
}));

server.register(routes);

server.listen({port: 8083}, async (err, address) => {
  if (err) {
    throw err;
  }
});
