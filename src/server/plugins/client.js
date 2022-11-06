const fp = require('fastify-plugin');
const Session = require('../../venom/session.js');

module.exports = fp(async function(fastify, opts, done) {
  const whatsapp = new Session();
  const client = await whatsapp.create();
  fastify.decorate('whatsapp', client);
  done();
});
