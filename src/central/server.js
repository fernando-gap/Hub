require('dotenv').config({
  path: require('node:path')
      .resolve(__dirname, '../../.env'),
});

const execute = require('./operation');
const wp = require('../wrapper.js');

const fastify = require('fastify');
const server = fastify();


server.post('/', async (request, reply) => {
  if (request.body.axiom === '$') {
    await wp(async () => {
      return await execute
          .service(
              request.body.entry,
              ...request.body.arguments,
          );
    });
  } else {
    await wp(async () => {
      return await execute
          .command(
              request.body.entry,
              null,
              ...request.body.arguments,
          );
    });
  }
});

server.listen({
  port: process.env.PORT_CENTRAL,
}, (err, address) => console.log(err, address));
