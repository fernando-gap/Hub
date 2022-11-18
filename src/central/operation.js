/**
 * TODO: RUN these commands in a container to avoid harmful commands
 */

const path = require('path');
const util = require('node:util');
const {readFile} = require('node:fs/promises');

const execFile = util.promisify(require('node:child_process').execFile);

/**
 * Command changes the server state
 * @param {string} bin
 * @param {string} [config=null]
 * @param {string[]} args
 */
async function command(bin, config, ...args) {
  if (!config) {
    config = path.resolve(__dirname, './command.json');
  }

  config = JSON.parse(await readFile(config));
  let body = '';

  try {
    const {stdout, stderr} = await execFile(config[bin], args);
    body = stdout || stderr;
  } catch (e) {
    body = 'Invalid Command';
  } finally {
    return {
      body: body,
    };
  }
}

/**
 * Executes a shell script
 * @param {string} bin
 * @param {string[]} args
 */
async function service(bin, ...args) {
  // TODO: Be able to send a file after the execution of a command
  try {
    const {stdout, stderr} = await execFile(bin, args);
    body = stdout || stderr;
  } catch (e) {
    body = `Unable to run command: ${e.message}`;
  } finally {
    return {
      body: body,
    };
  }
}

module.exports = {
  command,
  service,
};
