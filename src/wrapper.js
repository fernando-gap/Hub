const axios = require('axios');

const uri = {
  port: process.env.PORT_WPP,
  host: process.env.HOST_WPP,
  endpoint: process.env.SEND_ENDPOINT,
};

/**
 * Send Callback response to Whatsapp
 * @callback actionCallback
 * @param {actionCallback} callback - Callback that returns data to be sent
 * @param {number} [retries=5]
 */
async function wrap(callback, retries=5) {
  if (retries === 0) {
    return;
  }

  try {
    const response = await callback();
    console.log('RECEIVED WRAP', response);

    if (response.hasOwnProperty('body')) {
      await axios.post(`http://${uri.host}:${uri.port}/${uri.endpoint}`, response);
    }
  } catch (e) {
    console.log(e);
    await wrap(callback, retries-1);
  }
}

module.exports = wrap;
