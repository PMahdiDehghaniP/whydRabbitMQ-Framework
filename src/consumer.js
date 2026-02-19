const consumeMessage = async (channel, config, logger) => {
  const {
    queue,
    handler,
    prefetch = 1,
    requeueOnError = false,
    parser = JSON.parse,
  } = config;

  await channel.prefetch(prefetch);

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      let content = msg.content.toString();
      if (parser) content = parser(content);

      await handler(content, msg);
      channel.ack(msg);
    } catch (err) {
      logger.error(`Error processing message: ${err.message}`);
      channel.nack(msg, false, requeueOnError);
    }
  });
};

module.exports = { consumeMessage };
