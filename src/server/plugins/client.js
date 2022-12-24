const fp = require('fastify-plugin');
const {Worker} = require('node:worker_threads');

/**
 * Ensure shared libraries remain in memory
 * https://sharp.pixelplumbing.com/install#worker-threads
 * TODO: avoid referencing links, instead explain it.
 */
require('sharp');

module.exports = fp(async function(fastify, opts, done) {
  /**
   *  Creates a instance of venom
   *  @return {Promise} - Whether the venom started or exited.
   */
  function whatsapp() {
    const client = new Worker('./venom/main.js');

    return new Promise((resolve, reject) => {
      client.on('exit', (exitCode) => {
        console.log(`Worker exited ${exitCode}`);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject();
      });

      client.on('message', (message) => {
        if (message === 'ready') {
          fastify.decorate('whatsapp', client);
          resolve();
        }
      });
    });
  }

  /**
   * The application must keep trying to connect
   */
  while (true) {
    try {
      await whatsapp();
      break;
    } catch (e) {
      console.log('Restarting whatsapp connection....');
    }
  }
  done();
});
