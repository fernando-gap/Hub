const Message = require('./parser.js');
const axios = require('axios');

/**
 * Awaits for message events from whatsapp client
 */
class Receive extends Message {
  /**
   * Set message numbers
   * @param {object} whatsapp
   * @param {string} number - Phone number
   */
  constructor(whatsapp, number) {
    super();

    if (!whatsapp.isConnected()) {
      throw new Error('Whatsapp client is not connected');
    }

    this.number = number;
    this.defaultNumber = this.number + '@c.us'; // server
    this.whatsapp = whatsapp;
  }
  /**
   * Receive messages
   */
  message() {
    this.whatsapp.onMessage(async (message) => {
      console.log(message);
      if (!message.from === this.number) {
        return null;
      }

      const info = this.parseFromWhatsapp(message);

      if (info.isCommand) {
        // send message to central
      } else {
        await axios.post(process.env.LEON_URL, {
          message: message.body,
        });
      }
    });
  }
}

module.exports = Receive;
