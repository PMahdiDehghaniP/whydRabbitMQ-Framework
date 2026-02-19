const amqp = require("amqplib")

class ConnectionManager {
  constructor(url, logger,retryInterval = 5000) {
    this.url = url
    this.logger = logger || console
    this.connection = null
    this.channel = null
    this.retryInterval = retryInterval
  }

  async connect() {
    while (!this.connection) {
      try {
        this.connection = await amqp.connect(this.url)

        this.connection.on("error", err => {
          this.logger.error("RabbitMQ error", err)
          this.connection = null
          this.channel = null
        })

        this.connection.on("close", () => {
          this.logger.warn("RabbitMQ closed. Reconnecting...")
          this.connection = null
          this.channel = null
          setTimeout(() => this.connect(), this.retryInterval)
        })

        this.channel = await this.connection.createConfirmChannel()
        this.logger.info("RabbitMQ connected")
      } catch (err) {
        this.logger.error("RabbitMQ connect failed", err)
        await new Promise(r => setTimeout(r, this.retryInterval))
      }
    }
  }

  async getChannel() {
    if (!this.channel) await this.connect()
    return this.channel
  }

  async close() {
    if (this.channel) await this.channel.close()
    if (this.connection) await this.connection.close()
    this.channel = null
    this.connection = null
    this.logger.info("RabbitMQ connection closed")
  }
}

module.exports = ConnectionManager
