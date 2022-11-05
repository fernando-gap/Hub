
/** Parse messages from and to whatsapp */
class Message {
  /**
   * @param {object} message
   * @return {object}
   */
  parseFromWhatsapp(message) {
    if (message.body.startsWith('!')) {
      const args = message.body.split(' ');
      return {
        entry: args[0].substr(1),
        axiom: args[0][0],
        arguments: args.splice(1),
        isCommand: true,
        text: message.body,
      };
    } else if (message.body.startsWith('$')) {
      const args = message.body.split(' ');
      return {
        entry: args[0].substr(1),
        axiom: args[0][0],
        arguments: args.splice(1),
        isCommand: true,
        text: message.body,
      };
    } else {
      return {
        message: message.body,
        isCommand: false,
      };
    }
  }

  /**
   * @param {object} message
   * @param {number} [limit=30]
   * @return {object}
   */
  parseToWhatsapp(message, limit=30) {
    this.limit = limit;
    const words = message.body;

    if (Array.isArray(words)) {
      return this.#parseToWhatsappRecursive(message);
    }

    let text = '';
    const listIndex = words.search(':');

    if (!message.hasOwnProperty('hasAttachments')) {
      message.hasAttachments = false;
    }

    /** check whether a list exist */
    if (~listIndex) {
      text = this.#toWhatsappList(words, listIndex);
      return {
        original: message.body,
        hasAttachments: message.hasAttachments,
        attachments: message.attachments || [],
        text: text,

      };
    }

    let size = 0;
    for (let i = 0; i < words.length; ++i) {
      ++size;
      text += words[i];

      if (words[i] == ' ') {
        if (size >= this.limit) {
          text = text.trim() + '\n';
          size = 0;
        }
      }
    }

    const result = {};

    if (message.hasAttachments) {
      result.attachments = message.attachments;
    } else {
      result.attachments = [];
    }

    result.hasAttachments = message.hasAttachments;
    result.original = message.body;
    result.text = text;

    return result;
  }
  /**
   * Parse list to whatsapp
   * @param {string} message
   * @param {number} listIndex - List start
   * @return {object}
   * @private
   */
  #toWhatsappList(message, listIndex) {
    let text = '';
    for (const char of message) {
      if (char != ':') {
        text += char;
      } else {
        text += ':\n';
        break;
      }
    }

    const items = message.substr(listIndex+1).split('.');

    for (let item = 0; item < items.length-1; ++item) {
      items[item] = `_${item+1}._     ${items[item].trim()}.`;
    }

    text += items.join('\n');

    return text;
  }

  /**
   * Parse messages recursively to whatsapp
   * @param {string} message
   * @return {object}
   * @private
   */
  #parseToWhatsappRecursive(message) {
    if (!message.hasOwnProperty('hasAttachments')) {
      message.hasAttachments = false;
    }

    const result = {
      text: [],
    };

    for (const words of message.body) {
      let text = '';
      let size = 0;
      const listIndex = words.search(':');

      /** check whether a list exist */
      if (~listIndex) {
        result.text = result.text
            .concat(this.#toWhatsappList(words, listIndex));

        /** only create a list */
        continue;
      }

      for (let i = 0; i < words.length; ++i) {
        ++size;
        text += words[i];

        if (words[i] == ' ') {
          if (size >= this.limit) {
            text = text.trim() + '\n';
            size = 0;
          }
        }
      }

      result.text = result.text.concat(text);
    }

    if (message.hasAttachments) {
      result.attachments = message.attachments;
    } else {
      result.attachments = [];
    }

    result.hasAttachments = message.hasAttachments;
    result.original = message.body;
    return result;
  }
}


module.exports = Message;
