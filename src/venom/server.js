const {Server: ServerIO} = require('socket.io');
const fastify = require('fastify');

const path = require('path');

/** This server is temporary */
class Server {
  /**
   * @param {object} [options]
   * @param {number} [port]
   */
  start(options={}, port=8001) {
    this.fastify = fastify(options);
    this.port = port;

    this.fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, 'web'),
      prefix: '/',
    });

    this.routes();
  }

  /**
   * @param {function} callback
   */
  events(callback) {
    this.io.on('connection', (socket) => {
      callback(socket);
    });
  }

  /**
   * @param {function} callback
   */
  socket(callback) {
    this.io = new ServerIO(this.fastify.server);
    this.events(callback);
    this.listen();
  }

  /**
   * Attach routes to fastify
   */
  routes() {
    this.fastify.get('/', (request, reply) => {
      reply.sendFile('index.html');
    });
  }

  /**
   * Listen on some port
   */
  listen() {
    this.fastify.listen({port: this.port}, (err, address) => {
      if (err) {
        throw err;
      }
      console.log(`QR server is listening at ${address}`);
    });
  }

  /**
   * Close fastify instance
   */
  close() {
    this.fastify.close(() => {
      console.log('QR Server already satisfied. Closing...');
    });
  }
}

module.exports = Server;
