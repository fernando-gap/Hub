const venom = require('venom-bot');

/**
 * Create a new whatsapp session using venom
 */
class Session {
  /**
   * @param {string} [name]
   * @param {object} [options] - Options to pass to the session
   */
  constructor(name='server', options={}) {
    this.name = name;
    this.options = options || 'Empty';
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
          this.name, this.qrCode,
          this.status, this.options,
      );
      return client;
    } catch (error) {
      return this.create(attempts-1);
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
    const matches = base64QrImg.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};
    if (matches.length !== 3) {
      throw new Error('Invalid input string');
    }

    response.type = matches[1];

    // eslint-disable-next-line new-cap
    response.data = new Buffer.from(matches[2], 'base64');

    const imageBuffer = response;
    require('fs').writeFile(
        './web/assets/qr.png',
        imageBuffer['data'],
        'binary',
        function(err) {
          if (err != null) {
            console.log(err);
          }
        },
    );
  }
  /**
   * Get session status while connecting
   * @param {string} statusSession
   * @param {string} session - session's name
   */
  status(statusSession, session) {
    console.log('status: ', statusSession);
  }
}

module.exports = Session;
