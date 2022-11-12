const Receive = require('../../venom/receive.js');
const Send = require('../../venom/send.js');

module.exports = function(fastify, opts, done) {
  const receive = new Receive(fastify.whatsapp, process.env.NUMBER);
  receive.message();

  fastify.post('/send/to/whatsapp', async (request, reply) => {
    try {
      const message = new Send(fastify.whatsapp, process.env.NUMBER);
      await message.reply(request.body);
      return {
        'status': 200,
        'description': 'message sent',
      };
    } catch (e) {
      return {
        'status': 503,
        'description': 'message cannot be sent',
      };
    }
  });
  done();
};
