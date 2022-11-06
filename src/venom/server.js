const { Server: ServerIO } = require('socket.io');
const fastify = require('fastify');

const path = require('path');
const fs = require('fs');
const Blob = require('buffer').Blob;

/** This server is temporary */
class Server {

  start(options={}, port=8001) {
    this.fastify = fastify(options);
    this.port = port;

    this.fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, 'web'),
      prefix: '/',
    });

    this.routes();
  }

  events(callback) {
    this.io.on('connection', (socket) => {
      callback(socket);
    });
  }

  socket(callback) {
    this.io = new ServerIO(this.fastify.server);
    this.events(callback);
    this.listen();
  }

  routes() {
    this.fastify.get('/', (request, reply) => {
      reply.sendFile('index.html');
    });
  }

  listen() {
    this.fastify.listen({ port: this.port }, (err, address) => {
      if (err) {
        throw err;
      }
      console.log(`QR server is listening at ${address}`);
    });
  }

  close() {
    this.fastify.close(() => {
      console.log('QR Server already satisfied. Closing...');
    });
  }
}

module.exports = Server;
