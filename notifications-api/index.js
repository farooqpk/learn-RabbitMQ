const express = require("express");
const amqp = require("amqplib");

const app = express();
const amqpUrl = `amqp://localhost:5672`;

app.get("/", async (req, res) => {
  res.send("NOTIFCATIONS API");
});
 
async function connect() {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue("order.shipped");
    channel.consume("order.shipped", (msg) => {
      console.log(JSON.parse(msg.content.toString()));
      channel.ack(msg); // acknowledge the message so that it wont repeat the same message
    });
  } catch (error) {
    console.log(error);
  }
}

connect();

app.listen(8001, () => {
  console.log("Listening on PORT 8001");
});
