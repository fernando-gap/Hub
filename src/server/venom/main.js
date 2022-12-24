const Session = require('./session.js');
const Receive = require('./receive.js');
const Send = require('./send.js');

const {parentPort} = require('node:worker_threads');
const {rm} = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const whatsapp = new Session();

  try {
    const client = await whatsapp.create();
    console.log(client);
    parentPort.postMessage('ready');

    const receive = new Receive(client, process.env.NUMBER);
    const send = new Send(client, process.env.NUMBER);
    receive.message();

    parentPort.on('message', (message) => {
      send.reply(message);
    });
  } catch (e) {
    const tokensFolder = path.resolve(__dirname, './tokens');
    await rm(tokensFolder, {
      recursive: true,
      force: true,
    });
    process.exit(1);
  }
})();
