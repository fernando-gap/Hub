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
      if (!message.from === this.number) {
        return null;
      }

      const info = this.parseFromWhatsapp(message);
      console.log(info);

      try {
        if (info.isCommand) {
          const uri = {
            port: process.env.PORT_CENTRAL,
            host: process.env.HOST_CENTRAL,
          };
          await axios.post(`http://${uri.host}:${uri.port}/`, info);
        } else {
          await axios.post(process.env.LEON_URL, {
            message: message.body,
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
  }
}

module.exports = Receive;
