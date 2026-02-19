const ConnectionManager = require("./connection");
const { createQueue } = require("./topology");
const { publishMessage } = require("./publisher");
const { consumeMessage } = require("./consumer");
const setupShutdown = require("./shutdown");

class RabbitFramework {
  constructor({ url, logger, retryInterval }) {
    this.logger = logger || console;
    this.conn = new ConnectionManager(url, this.logger, retryInterval);
  }

  async init() {
    await this.conn.connect();
    setupShutdown(this.conn, this.logger);
  }

  async createQueue(config) {
    const ch = await this.conn.getChannel();
    return createQueue(ch, config, this.logger);
  }

  async publish(config) {
    const ch = await this.conn.getChannel();
    return publishMessage(ch, config, this.logger);
  }

  async consume(config) {
    const ch = await this.conn.getChannel();
    return consumeMessage(ch, config, this.logger);
  }

  async close() {
    await this.conn.close();
  }
}

module.exports = RabbitFramework;
