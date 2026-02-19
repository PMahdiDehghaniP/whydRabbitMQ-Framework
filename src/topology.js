const createQueue = async (channel, config, logger) => {
  const {
    queue,
    exchange,
    type = "direct",
    routingKey = "",
    dlq = false,
  } = config;

  let args = {};

  if (dlq) {
    const dlqName = queue + ".dlq";
    const dlx = queue + ".dlx";

    await channel.assertExchange(dlx, "direct", { durable: true });
    await channel.assertQueue(dlqName, { durable: true });
    await channel.bindQueue(dlqName, dlx, queue);

    args["x-dead-letter-exchange"] = dlx;
    args["x-dead-letter-routing-key"] = queue;
  }

  await channel.assertQueue(queue, {
    durable: true,
    arguments: args,
  });

  if (exchange) {
    await channel.assertExchange(exchange, type, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);
  }

  logger.info("Queue ready:", queue);
};

module.exports = { createQueue };
