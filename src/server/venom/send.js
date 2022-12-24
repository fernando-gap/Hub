const Message = require('./parser');

/**
 * Send message from client to number
 */
class Send extends Message {
  /**
   * Set receiver's number and client's
   * @param {object} whatsapp
   * @param {string} number - Phone number
   */
  constructor(whatsapp, number) {
    super();
    if (!whatsapp.isConnected()) {
      throw new Error('Whatsapp client is not connected');
    }

    this.whatsapp = whatsapp;
    this.number = number;
    this.defaultNumber = this.number + '@c.us'; // server
  }

  /**
   * Send a message
   * @param {object} message
   * @param {string|array} message.body
   * @async
   */
  async reply(message) {
    message = this.parseToWhatsapp(message);

    if (Array.isArray(message.text)) {
      for (let msg = 0; msg < message.text.length; ++msg) {
        await this.whatsapp.sendText(this.defaultNumber, message.text[msg]);
      }
    } else {
      await this.whatsapp.sendText(this.defaultNumber, message.text);
    }

    if (message.hasAttachments) {
      for (let file = 0; file < message.attachments.length; ++file) {
        this.whatsapp.sendFile(
            this.defaultNumber,
            message.attachments[file].path,
            message.attachments[file].name,
            message.attachments[file].desc || '',
        );
      }
    }
  }
}

module.exports = Send;
