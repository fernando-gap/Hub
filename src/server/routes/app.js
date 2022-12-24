module.exports = function(fastify, opts, done) {
  fastify.post('/send/to/whatsapp', async (request, reply) => {
    fastify.whatsapp.postMessage(request.body);
    return {status: 'sent'};
  });
  done();
};
