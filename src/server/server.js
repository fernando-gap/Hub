const fastify = require('fastify');
const session = require('./plugins/client.js');
const routes = require('./routes/app.js');

const cors = require('@fastify/cors');

const server = fastify({
  pluginTimeout: 1000 * 60 * 5,
});

server.register(cors, {
  origin: '*',
});

server.register(session);
server.register(routes);

server.listen({
  port: process.env.PORT,
  host: process.env.HOST,
}, function(err, address) {
  if (err) {
    throw err;
  }
  console.log(`Server started at ${address}`);
});
