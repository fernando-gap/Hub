const venom = require('venom-bot');
const path = require('path')
const Server = require('../venom/server.js');

/**
 * Create a new whatsapp session using venom
 */
class Session extends Server {
  /**
   * @param {string} [name]
   * @param {object} [options] - Options to pass to the session
   */
  constructor(name='server', options={}) {
    super();
    if (options && Object.keys(options).length === 0) {
      this.options = {
        name: name,
        multidevice: true,
        logQR: false,
      };
    } else {
      this.options = options;
    }
    this.name = name;

    this.start();
    this.socket((socket) => {
      this.socket = socket;
    });
  }
  /**
   * @param {number} [attempts] - amount of attempts to reconnect
   * @throws Will an error if the session had failed to connect
   * @return {object}
   */
  async create(attempts=5) {
    if (attempts < 1) {
      throw new Error('Application Can\'t Stabilish Connection');
    }
    try {
      const client = await venom.create(
          this.name, this.qrCode.bind(this),
          this.status.bind(this), this.options,
      );
      return client;
    } catch (error) {
      console.log(error);
      console.log('\n\nError...', attempts);

      try {
        await unlink(path.join(__dirname, 'tokens'));
        return this.create(attempts-1);
      } catch(e) {
        return this.create(attempts-1);
      }
    }
  }
  /**
   * Get QR code from session and save in file
   * @param {string} base64QrImg
   * @param {string} asciiQR
   * @param {number} attempts
   * @param {string} urlCode
   * @throws {Error} whether a input for base64QrImg is invalid
   */
  qrCode(base64QrImg, asciiQR, attempts, urlCode) {
    if (this.socket && typeof this.socket.emit === 'function') {
      this.socket.emit('qr', base64QrImg);
    }
  }
  /**
   * Get session status while connecting
   * @param {string} statusSession
   * @param {string} session - session's name
   */
  status(statusSession, session) {
    console.log();
    console.log(statusSession);
    console.log();

    if (statusSession === 'qrReadSuccess') {
      this.close();
    }
  }
}

module.exports = Session;
