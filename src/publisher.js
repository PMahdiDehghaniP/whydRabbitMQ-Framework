const publishMessage = async (channel, config, logger) => {
  const { exchange, routingKey = "", message, headers = {} } = config;

  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
    persistent: true,
    headers,
  });

  await channel.waitForConfirms();
  logger.info(
    `Message ${JSON.stringify(message)} Published To Exchange ${exchange} With Routing Key ${routingKey}`,
  );
};

module.exports = { publishMessage };
