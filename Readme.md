# 🐇 whydRabbitMQ-Framework

A **robust, reusable, and production-ready RabbitMQ framework for Node.js** — designed to help you build message-driven microservices faster and safer.

📦 Supports:
✔ Automatic reconnection  
✔ Queue & exchange setup  
✔ Dead Letter Queue (DLQ)  
✔ Reliable publishing with confirms  
✔ Consumer with prefetch & safe error handling  
✔ Custom logger support  
✔ Graceful shutdown  
✔ Works with all major exchange types

---

## 🧠 Features

This framework simplifies working with RabbitMQ by providing:

- Automatic connection & channel management
- Support for all exchange types:
  - `direct`
  - `fanout`
  - `topic`
  - `headers`
- Dead Letter Queue (DLQ) creation
- Reliable publisher (`waitForConfirms`)
- Automatic retries and optional requeue
- Parser injection (JSON or custom)
- Graceful shutdown and reconnect logic
- Logger abstraction (supports pino, winston, console, etc.)

---

## 🚀 Quick Start

### 1️⃣ Install

```bash
git clone https://github.com/PMahdiDehghaniP/whydRabbitMQ-Framework.git
cd whydRabbitMQ-Framework
npm install
```

Or on npm:

```bash
npm install whyd-rabbitmq-framework
```

### 2️⃣ Environment

Create a .env file or export the following environment variable:

```bash
RABBITMQ_HOST=amqp://localhost
NODE_ENV=development
```

## 🔌 Usage

### 1️⃣ Publisher

```javascript
const { publishMessage } = require("whyd-rabbitmq-framework");

const message = { text: "Hello World" };

// Publish to a queue
publishMessage({
  name: "task_queue",
  type: "queue",
  message,
});

// Publish to an exchange
publishMessage({
  name: "logs",
  type: "fanout", // direct, topic, headers
  message,
  routingKey: "",
  headers: { "x-match": "all", level: "info" }, // only for headers exchange
});
```

### 2️⃣ Consumer

```javascript
const { consumeMessage } = require("whyd-rabbitmq-framework");

consumeMessage({
  exchangeName: "logs",
  exchangeType: "fanout",
  queueName: "log_consumer",
  prefetch: 1, // max messages per worker
  requeueOnError: true, // requeue messages if error occurs
  parser: JSON.parse, // optional custom parser
  callback: async (msg) => {
    console.log("Received:", msg);
    // Your processing logic
  },
});
```

### 3️⃣ Queue Setup

```javascript
const { setUpQueue } = require("whyd-rabbitmq-framework");

// Set up a direct queue
await setUpQueue("direct", null, "task_queue", "routing_key");

// Set up a headers exchange
await setUpQueue("headers", "logs_headers", "header_queue", "", {
  "x-match": "all",
  level: "info",
});
```

## 📝 Logger Support

You can inject any logger that implements info, warn, and error methods:

```javascript
const customLogger = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};

const { setLogger } = require("whyd-rabbitmq-framework");
setLogger(customLogger);
```

## 💡 Tips

- Use prefetch=1 for fair dispatch among multiple workers.

- Mark queues and messages as durable/persistent to survive RabbitMQ restarts:

```javascript
await channel.assertQueue("task_queue", { durable: true });
await channel.sendToQueue("task_queue", Buffer.from(JSON.stringify(msg)), {
  persistent: true,
});
```

- Use headers exchanges for dynamic routing without routing keys.

- For temporary consumers (like log listeners), use exclusive, non-durable queues.
