const fastify = require('fastify');
const session = require('./plugins/client.js');

const server = fastify({
  pluginTimeout: 1000 * 60 * 5,
});

server.register(session);

server.listen({
  port: process.env.PORT,
  host: process.env.HOST,
}, function(err, address) {
  if (err) {
    throw err;
  }
  console.log(`Server started at ${address}`);
});
