const axios = require('axios');

async function wrap(callback, retries=5) {
  if (retries === 0) {
    return;
  }

  try {
    const response = await callback();

    if (response.hasOwnProperty('body')) {
      await axios.post(process.env.SEND_ENDPOINT, response);
    }

  } catch (e) {
    await wrap(callback, retries-1);
  }
}

module.exports = wrap;
