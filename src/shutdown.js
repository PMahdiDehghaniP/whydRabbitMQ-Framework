function setupShutdown(rabbit, logger) {
  const shutdown = async () => {
    logger.info("Shutting down RabbitMQ...");
    await rabbit.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

module.exports = setupShutdown;
