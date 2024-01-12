const express = require("express");
const app = express();
const amqp = require("amqplib");

const amqpUrl = `amqp://localhost:5672`;

const orderData = {
  customerId: 8,
  orderId: 10,
  phone: "98357383",
};

app.get("/", async (req, res) => {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel(); // channel contains multiple queues
    await channel.assertQueue("order.shipped"); // it upsert the queue to that channel
    channel.sendToQueue(
      "order.shipped",
      Buffer.from(JSON.stringify(orderData))
    );
    res.send("ORDERS API");
  } catch (error) {
    console.log(error);
  }
});

app.listen(8000, () => {
  console.log("ORDERS API listening on port 8000");
});
