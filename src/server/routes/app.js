module.exports = function(fastify, opts, done) {
  fastify.get('/qr', (req, reply) => {
    reply.sendFile('index.html');
  });
}
